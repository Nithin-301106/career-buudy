export type ActiveTab =
  | 'overview'
  | 'resume-builder'
  | 'interview-questions'
  | 'answer-improver'
  | 'career-guidance'
  | 'skill-roadmap'
  | 'cover-letter';

export interface ResumeData {
  summary: string;
  formattedMarkdown: string;
  sections: {
    contact: {
      name: string;
      email: string;
      phone: string;
      location: string;
    };
    education: string[];
    skills: {
      technical: string[];
      toolsAndPlatforms: string[];
      softSkills: string[];
    };
    projects: Array<{
      title: string;
      technologies: string;
      bulletPoints: string[];
    }>;
    experience: Array<{
      role: string;
      organization: string;
      period: string;
      bulletPoints: string[];
    }>;
    achievementsAndCertifications: string[];
  };
  atsTips: string[];
}

export interface InterviewQuestion {
  id: number;
  type: 'Technical' | 'HR / Behavioral';
  question: string;
  whyInterviewerAsks: string;
  guidancePoints: string[];
  difficulty: 'Beginner' | 'Intermediate';
}

export interface InterviewQuestionsResponse {
  role: string;
  disclaimer: string;
  questions: InterviewQuestion[];
  preparationStrategy: string;
}

export interface AnswerImproverResponse {
  improvedAnswer: string;
  starMethod: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  strengths: string[];
  improvements: string[];
  deliveryTips: string[];
  rubricAssessment: {
    clarity: string;
    structure: string;
    confidence: string;
  };
}

export interface CareerPath {
  title: string;
  tagline: string;
  whyItFits: string;
  entryRoles: string[];
  coreSkills: string[];
  qualifications: string[];
  dayInTheLife: string;
  growthTrajectory: string;
}

export interface CareerGuidanceResponse {
  summary: string;
  careerPaths: CareerPath[];
  actionPlan30Days: Array<{
    week: string;
    focus: string;
    task: string;
  }>;
}

export interface RoadmapStage {
  stage: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  goal: string;
  topics: string[];
  projects: Array<{
    name: string;
    description: string;
    deliverables: string;
  }>;
  freeResources: Array<{
    name: string;
    type: string;
    notes: string;
  }>;
}

export interface SkillRoadmapResponse {
  title: string;
  description: string;
  estimatedDuration: string;
  stages: RoadmapStage[];
  capstoneProject: {
    title: string;
    summary: string;
    resumeBulletPointExample: string;
  };
  mentorTips: string[];
}

export interface CoverLetterResponse {
  subjectLine: string;
  coverLetter: string;
  keyHighlights: string[];
  customizationAdvice: string;
}
