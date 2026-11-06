import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client safely
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured. Please configure it in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Resilient wrapper with automatic retry for transient 503/429 spikes
async function generateWithRetry(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction: string,
  maxRetriesPerModel = 2
): Promise<string> {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || '');
        const isTransient =
          msg.includes('503') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('429') ||
          msg.includes('high demand') ||
          msg.includes('RESOURCE_EXHAUSTED');

        if (isTransient && attempt < maxRetriesPerModel) {
          const delay = Math.min(1000 * attempt + Math.random() * 300, 3000);
          console.warn(`[Gemini API] Transient ${model} issue on attempt ${attempt}. Retrying in ${Math.round(delay)}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        // If transient error persisted for this model, break to try the fallback model
        console.warn(`[Gemini API] ${model} unavailable (${msg.slice(0, 100)}). Trying fallback model...`);
        break;
      }
    }
  }

  throw lastError || new Error('Failed to generate response after retrying.');
}

function cleanAndParseJSON(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

// 0. Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    app: 'AI Career Buddy',
    timestamp: new Date().toISOString(),
  });
});

// 1. Resume Builder
app.post('/api/career/resume', async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phone,
      location,
      targetRole,
      education,
      skills,
      projects,
      achievements,
      experience,
    } = req.body;

    if (!fullName || !education || !skills) {
      return res.status(400).json({
        error: 'Please provide at least your full name, education details, and key skills.',
      });
    }

    const ai = getGeminiClient();

    const prompt = `You are a certified professional resume strategist for college students and recent grads.
Generate a high-impact, ATS-optimized, modern resume draft based strictly on the student's authentic details below.
Do NOT fabricate any unmentioned degrees, institutions, or awards. Ensure action-oriented bullet points using the XYZ formula (Accomplished [X] as measured by [Y] by doing [Z]).

Student Details:
- Full Name: ${fullName}
- Contact: Email: ${email || 'student@example.edu'}, Phone: ${phone || '(555) 000-0000'}, Location: ${location || 'Campus / City'}
- Target Role / Domain: ${targetRole || 'Entry-level Intern / Fresher'}
- Education: ${education}
- Technical & Soft Skills: ${skills}
- Academic & Personal Projects: ${projects || 'None specified'}
- Extracurriculars, Certifications & Achievements: ${achievements || 'None specified'}
- Work / Internship Experience: ${experience || 'None specified'}

Output JSON schema matching:
{
  "summary": "Compelling 2-3 sentence professional summary tailored to the target role",
  "formattedMarkdown": "Complete markdown resume formatted with headers (##), bold text, and bullet points",
  "sections": {
    "contact": { "name": "${fullName}", "email": "${email || ''}", "phone": "${phone || ''}", "location": "${location || ''}" },
    "education": [ "string" ],
    "skills": {
      "technical": [ "string" ],
      "toolsAndPlatforms": [ "string" ],
      "softSkills": [ "string" ]
    },
    "projects": [
      {
        "title": "string",
        "technologies": "string",
        "bulletPoints": [ "string" ]
      }
    ],
    "experience": [
      {
        "role": "string",
        "organization": "string",
        "period": "string",
        "bulletPoints": [ "string" ]
      }
    ],
    "achievementsAndCertifications": [ "string" ]
  },
  "atsTips": [ "string" ]
}`;

    const text = await generateWithRetry(
      ai,
      prompt,
      'You are an expert college resume writer. Return valid JSON only. Always emphasize genuine student projects, coursework, and skills without fabricating credentials.'
    );

    const parsed = cleanAndParseJSON(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating resume:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate resume draft. Please check your inputs and try again.',
    });
  }
});

// 2. Interview Question Generator
app.post('/api/career/interview-questions', async (req: Request, res: Response) => {
  try {
    const { role, domain, level } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Please enter a target job role or domain.' });
    }

    const ai = getGeminiClient();

    const prompt = `You are a university hiring manager and technical interviewer.
Generate EXACTLY 10 relevant practice interview questions for a college student / entry-level candidate preparing for:
- Role: ${role}
- Domain / Industry: ${domain || 'General Tech & Professional'}
- Level: ${level || 'Internship / Entry-Level'}

Structure:
- 6 Technical / Domain-Specific Questions testing fundamental knowledge, problem-solving, and practical application.
- 4 HR / Behavioral / Situational Questions testing teamwork, adaptability, conflict resolution, and enthusiasm.
All questions must be realistic practice questions for undergraduates.

Return JSON schema:
{
  "role": "${role}",
  "disclaimer": "These questions are generated for self-practice and interview preparation. Actual interview questions may vary.",
  "questions": [
    {
      "id": 1,
      "type": "Technical",
      "question": "string",
      "whyInterviewerAsks": "What the interviewer is evaluating in a college candidate",
      "guidancePoints": [ "string", "string" ],
      "difficulty": "Beginner" | "Intermediate"
    }
  ],
  "preparationStrategy": "1-2 paragraphs of actionable advice for college students before their interview"
}`;

    const text = await generateWithRetry(
      ai,
      prompt,
      'You are an experienced college recruiter. Return exactly 10 high-yield practice questions in JSON format.'
    );

    const parsed = cleanAndParseJSON(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating interview questions:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate interview questions. Please try again.',
    });
  }
});

// 3. Interview Answer Improver
app.post('/api/career/improve-answer', async (req: Request, res: Response) => {
  try {
    const { question, userAnswer, role } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({
        error: 'Please provide both the interview question and your draft answer.',
      });
    }

    const ai = getGeminiClient();

    const prompt = `You are an encouraging interview coach for college students.
A student gave this draft answer to an interview question. Help them improve grammar, clarity, confidence, and structure (using the STAR method: Situation, Task, Action, Result).
Target Role: ${role || 'College Graduate / Intern'}
Question: "${question}"
Student's Draft Answer:
"${userAnswer}"

Analyze their draft constructively:
1. Provide an improved, professional, authentic version that sounds like a confident student (not robotic jargon).
2. Break down the improved version into STAR steps (Situation, Task, Action, Result).
3. List 2-3 genuine strengths in what they originally wrote.
4. List 3 concrete improvements made (e.g., eliminated filler words, quantified result, articulated personal contribution).
5. Give vocal/delivery coaching tips.

Return JSON schema:
{
  "improvedAnswer": "Full improved answer",
  "starMethod": {
    "situation": "string",
    "task": "string",
    "action": "string",
    "result": "string"
  },
  "strengths": [ "string" ],
  "improvements": [ "string" ],
  "deliveryTips": [ "string" ],
  "rubricAssessment": {
    "clarity": "Strong/Developing - brief explanation",
    "structure": "Strong/Developing - brief explanation",
    "confidence": "Strong/Developing - brief explanation"
  }
}`;

    const text = await generateWithRetry(
      ai,
      prompt,
      'You are an empathetic yet rigorous career coach for students. Return structured constructive feedback in JSON.'
    );

    const parsed = cleanAndParseJSON(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error improving answer:', error);
    return res.status(500).json({
      error: error.message || 'Failed to improve answer. Please try again.',
    });
  }
});

// 4. AI Career Guidance
app.post('/api/career/guidance', async (req: Request, res: Response) => {
  try {
    const { interests, skills, favoriteSubjects, degree } = req.body;

    if (!interests && !skills && !favoriteSubjects) {
      return res.status(400).json({
        error: 'Please share your interests, skills, or favourite subjects.',
      });
    }

    const ai = getGeminiClient();

    const prompt = `You are a university academic and career counselor.
Based on the student's profile, recommend 3 to 4 viable, realistic career paths for college students.

Student Profile:
- Degree / Major: ${degree || 'Undergraduate'}
- Key Interests: ${interests || 'General problem solving, tech, creativity'}
- Current Skills: ${skills || 'Foundation coursework'}
- Favourite Subjects: ${favoriteSubjects || 'Analytical & applied courses'}

For EACH suggested career path provide:
- Career Title
- Why It Fits (connecting specifically to their interests and favourite subjects)
- Typical Entry-Level Roles (internship / associate titles)
- Core Skills Needed (technical + soft skills)
- Required / Recommended Qualifications & Certifications
- Day in the Life (realistic 1-2 sentence description)
- Career Growth Path (fresher -> mid -> senior trajectory)

Also provide a "30-Day Action Plan" for the student to start exploring today.

Return JSON schema:
{
  "summary": "Warm encouraging overview connecting their strengths to modern market opportunities",
  "careerPaths": [
    {
      "title": "string",
      "tagline": "string",
      "whyItFits": "string",
      "entryRoles": [ "string" ],
      "coreSkills": [ "string" ],
      "qualifications": [ "string" ],
      "dayInTheLife": "string",
      "growthTrajectory": "string"
    }
  ],
  "actionPlan30Days": [
    { "week": "Week 1", "focus": "string", "task": "string" },
    { "week": "Week 2", "focus": "string", "task": "string" },
    { "week": "Week 3", "focus": "string", "task": "string" },
    { "week": "Week 4", "focus": "string", "task": "string" }
  ]
}`;

    const text = await generateWithRetry(
      ai,
      prompt,
      'You are an expert college career counselor. Suggest realistic, attainable career paths without guaranteeing employment outcomes.'
    );

    const parsed = cleanAndParseJSON(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating career guidance:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate career guidance. Please try again.',
    });
  }
});

// 5. Skill Learning Roadmap
app.post('/api/career/roadmap', async (req: Request, res: Response) => {
  try {
    const { careerOrSkill, currentLevel, timeframe } = req.body;

    if (!careerOrSkill) {
      return res.status(400).json({
        error: 'Please specify the career role or skill you want to learn.',
      });
    }

    const ai = getGeminiClient();

    const prompt = `You are a curriculum architect and mentor for college students.
Create a step-by-step learning roadmap for:
- Skill / Role: ${careerOrSkill}
- Current Student Level: ${currentLevel || 'Beginner'}
- Target Timeframe: ${timeframe || '3 Months Semester Track'}

Break the learning into EXACTLY 3 stages:
1. Beginner Stage (Foundations, core tools, basic concepts)
2. Intermediate Stage (Applied knowledge, frameworks, mini-projects)
3. Advanced Stage (Production-readiness, optimization, architecture, capstone)

For each stage provide:
- Stage Name (Beginner, Intermediate, Advanced)
- Time Allocation (e.g. "Weeks 1-4")
- Core Goals
- Key Topics to Master (4-6 bullet points)
- Practical Hands-on Projects (2 realistic student project ideas)
- Free / Open Learning Resources (documentation, YouTube channels, open-source courses, practice sites)

Include a final Capstone Project idea that students can feature on their resume/GitHub.

Return JSON schema:
{
  "title": "${careerOrSkill} Learning Roadmap",
  "description": "string",
  "estimatedDuration": "string",
  "stages": [
    {
      "stage": "Beginner",
      "duration": "string",
      "goal": "string",
      "topics": [ "string" ],
      "projects": [
        { "name": "string", "description": "string", "deliverables": "string" }
      ],
      "freeResources": [
        { "name": "string", "type": "Documentation/Tutorial/Course", "notes": "string" }
      ]
    },
    {
      "stage": "Intermediate",
      "duration": "string",
      "goal": "string",
      "topics": [ "string" ],
      "projects": [
        { "name": "string", "description": "string", "deliverables": "string" }
      ],
      "freeResources": [
        { "name": "string", "type": "Documentation/Tutorial/Course", "notes": "string" }
      ]
    },
    {
      "stage": "Advanced",
      "duration": "string",
      "goal": "string",
      "topics": [ "string" ],
      "projects": [
        { "name": "string", "description": "string", "deliverables": "string" }
      ],
      "freeResources": [
        { "name": "string", "type": "Documentation/Tutorial/Course", "notes": "string" }
      ]
    }
  ],
  "capstoneProject": {
    "title": "string",
    "summary": "string",
    "resumeBulletPointExample": "string"
  },
  "mentorTips": [ "string" ]
}`;

    const text = await generateWithRetry(
      ai,
      prompt,
      'You are a senior technical curriculum designer. Return structured, practical learning paths for students in JSON.'
    );

    const parsed = cleanAndParseJSON(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate learning roadmap. Please try again.',
    });
  }
});

// 6. Cover Letter Generator
app.post('/api/career/cover-letter', async (req: Request, res: Response) => {
  try {
    const { jobRole, companyName, studentName, qualifications, relevantExperiences, tone } = req.body;

    if (!jobRole || !companyName || !studentName) {
      return res.status(400).json({
        error: 'Please provide the Job Role, Company Name, and your Student Name.',
      });
    }

    const ai = getGeminiClient();

    const prompt = `You are a university career advisor helping a student write a tailored, compelling cover letter.
Job Role: ${jobRole}
Company Name: ${companyName}
Student Name: ${studentName}
Qualifications & Major: ${qualifications || 'Undergraduate student with relevant coursework'}
Relevant Projects & Experiences: ${relevantExperiences || 'Hands-on academic projects and collaborative coursework'}
Tone: ${tone || 'Professional & Enthusiastic'}

Write a tailored cover letter that:
1. Shows genuine enthusiasm for ${companyName} and the ${jobRole} opportunity.
2. Directly connects their student projects and coursework to the job's requirements.
3. Expresses eagerness to learn, contribute, and collaborate.
4. Maintains an authentic student voice without exaggerating achievements.
5. Formats with a professional greeting, 3-4 structured body paragraphs, and courteous sign-off.

Return JSON schema:
{
  "subjectLine": "Application for ${jobRole} - ${studentName}",
  "coverLetter": "Full markdown formatted cover letter including date, address block, greeting, body, and signoff",
  "keyHighlights": [ "string", "string", "string" ],
  "customizationAdvice": "Brief advice on what specific details the student should double check or research about ${companyName} before submitting"
}`;

    const text = await generateWithRetry(
      ai,
      prompt,
      'You are an expert student career coach. Output valid JSON containing an authentic, persuasive cover letter.'
    );

    const parsed = cleanAndParseJSON(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate cover letter. Please try again.',
    });
  }
});

// Serve frontend in production or mount vite middlewares in dev
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Career Buddy] Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
