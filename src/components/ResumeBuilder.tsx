import React, { useState } from 'react';
import { SAMPLE_RESUME_PROFILES } from '../data/sampleProfiles';
import { ResumeData } from '../types/career';
import {
  FileText,
  Copy,
  Check,
  Download,
  Sparkles,
  Loader2,
  RefreshCw,
  Eye,
  Code,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResumeBuilderProps {
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ onShowToast }) => {
  const [fullName, setFullName] = useState(SAMPLE_RESUME_PROFILES[0].fullName);
  const [email, setEmail] = useState(SAMPLE_RESUME_PROFILES[0].email);
  const [phone, setPhone] = useState(SAMPLE_RESUME_PROFILES[0].phone);
  const [location, setLocation] = useState(SAMPLE_RESUME_PROFILES[0].location);
  const [targetRole, setTargetRole] = useState(SAMPLE_RESUME_PROFILES[0].targetRole);
  const [education, setEducation] = useState(SAMPLE_RESUME_PROFILES[0].education);
  const [skills, setSkills] = useState(SAMPLE_RESUME_PROFILES[0].skills);
  const [projects, setProjects] = useState(SAMPLE_RESUME_PROFILES[0].projects);
  const [achievements, setAchievements] = useState(SAMPLE_RESUME_PROFILES[0].achievements);
  const [experience, setExperience] = useState(SAMPLE_RESUME_PROFILES[0].experience);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview');
  const [copied, setCopied] = useState(false);

  const handleLoadSample = (sample: typeof SAMPLE_RESUME_PROFILES[0]) => {
    setFullName(sample.fullName);
    setEmail(sample.email);
    setPhone(sample.phone);
    setLocation(sample.location);
    setTargetRole(sample.targetRole);
    setEducation(sample.education);
    setSkills(sample.skills);
    setProjects(sample.projects);
    setAchievements(sample.achievements);
    setExperience(sample.experience);
    onShowToast(`Loaded ${sample.label} sample profile!`);
  };

  const handleClear = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setTargetRole('');
    setEducation('');
    setSkills('');
    setProjects('');
    setAchievements('');
    setExperience('');
    setResumeData(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !education.trim() || !skills.trim()) {
      setError('Please fill in your Full Name, Education, and Skills to generate your resume.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/career/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      });

      const resJson = await response.json();

      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Failed to generate resume draft');
      }

      setResumeData(resJson.data);
      onShowToast('Resume draft generated successfully!');
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch {
        // Confetti fallback
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the resume.');
      onShowToast(err.message || 'Generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!resumeData) return;
    const textToCopy = resumeData.formattedMarkdown;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onShowToast('Resume copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onShowToast('Failed to copy. Please select and copy manually.', 'error');
    }
  };

  const downloadResume = () => {
    if (!resumeData) return;
    const blob = new Blob([resumeData.formattedMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fullName.replace(/\s+/g, '_')}_Resume_Draft.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Resume downloaded as Markdown file!');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Feature 01 · Resume Strategist</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            AI Resume Builder for College Students
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Enter your college education, technical & soft skills, coursework projects, and achievements. Gemini AI turns your inputs into a polished, professional ATS-friendly resume draft.
          </p>
        </div>

        {/* Quick Sample Profile Selector */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 shrink-0">
          <div className="text-xs font-semibold text-slate-700 mb-2">
            Load Sample Student Profile:
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_RESUME_PROFILES.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-md transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Your Student Information</h3>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              Clear Form
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {/* Full Name & Target Role */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Maya Patel"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@univ.edu"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">City, State</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Austin, TX"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">Target Role / Domain</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Software Intern"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Education */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Education & Coursework <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Degree, College name, Expected Grad Year, GPA (optional), Relevant Coursework"
                required
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 text-xs sm:text-sm resize-y"
              />
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Skills (Technical & Soft) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Languages, frameworks, developer tools, soft skills (comma separated)"
                required
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 text-xs sm:text-sm resize-y"
              />
            </div>

            {/* Projects */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Academic & Personal Projects
              </label>
              <textarea
                rows={3}
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                placeholder="Name of project, technologies used, what it does, and your role"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 text-xs sm:text-sm resize-y"
              />
            </div>

            {/* Experience */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Work, Campus Jobs or Internships (Optional)
              </label>
              <textarea
                rows={2}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Role, organization/club, responsibilities"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 text-xs sm:text-sm resize-y"
              />
            </div>

            {/* Achievements */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Achievements, Certifications & Clubs
              </label>
              <textarea
                rows={2}
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder="Hackathons, Dean's list, club leadership, certifications"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 text-xs sm:text-sm resize-y"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Professional Resume Draft...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Resume Draft</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Generated Resume Output */}
        <div className="lg:col-span-7 space-y-6">
          {resumeData ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Output Top Bar */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Draft for {fullName}
                  </span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-500 font-medium">ATS-Optimized</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="flex items-center p-0.5 bg-slate-200/70 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setViewMode('preview')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                        viewMode === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Preview
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('markdown')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                        viewMode === 'markdown' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        <Code className="w-3 h-3" /> Markdown
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Resume</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={downloadResume}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Resume Body */}
              <div className="p-6 sm:p-8 max-h-[750px] overflow-y-auto">
                {viewMode === 'preview' ? (
                  <div className="space-y-6 text-slate-800 max-w-3xl mx-auto font-sans">
                    {/* Header Block */}
                    <div className="text-center border-b border-slate-200 pb-5 space-y-1.5">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {resumeData.sections?.contact?.name || fullName}
                      </h1>
                      <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-slate-600">
                        {resumeData.sections?.contact?.email && (
                          <span>{resumeData.sections.contact.email}</span>
                        )}
                        {resumeData.sections?.contact?.phone && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{resumeData.sections.contact.phone}</span>
                          </>
                        )}
                        {resumeData.sections?.contact?.location && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{resumeData.sections.contact.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.summary && (
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1">
                          Professional Summary
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {resumeData.summary}
                        </p>
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.sections?.education && resumeData.sections.education.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1">
                          Education
                        </h4>
                        <ul className="space-y-1.5">
                          {resumeData.sections.education.map((edu, idx) => (
                            <li key={idx} className="text-xs sm:text-sm text-slate-800">
                              {edu}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Skills */}
                    {resumeData.sections?.skills && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1">
                          Skills & Competencies
                        </h4>
                        <div className="text-xs sm:text-sm space-y-1 text-slate-800">
                          {resumeData.sections.skills.technical?.length > 0 && (
                            <div>
                              <strong className="text-slate-900">Technical Skills: </strong>
                              <span>{resumeData.sections.skills.technical.join(', ')}</span>
                            </div>
                          )}
                          {resumeData.sections.skills.toolsAndPlatforms?.length > 0 && (
                            <div>
                              <strong className="text-slate-900">Tools & Platforms: </strong>
                              <span>{resumeData.sections.skills.toolsAndPlatforms.join(', ')}</span>
                            </div>
                          )}
                          {resumeData.sections.skills.softSkills?.length > 0 && (
                            <div>
                              <strong className="text-slate-900">Soft Skills: </strong>
                              <span>{resumeData.sections.skills.softSkills.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {resumeData.sections?.projects && resumeData.sections.projects.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1">
                          Academic & Personal Projects
                        </h4>
                        <div className="space-y-4">
                          {resumeData.sections.projects.map((proj, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                  {proj.title}
                                </span>
                                {proj.technologies && (
                                  <span className="text-xs text-slate-500 font-mono">
                                    {proj.technologies}
                                  </span>
                                )}
                              </div>
                              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-700 pl-1">
                                {proj.bulletPoints?.map((bp, bidx) => (
                                  <li key={bidx} className="leading-relaxed">
                                    {bp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience if present */}
                    {resumeData.sections?.experience && resumeData.sections.experience.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1">
                          Experience & Leadership
                        </h4>
                        <div className="space-y-3">
                          {resumeData.sections.experience.map((exp, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between items-baseline text-xs sm:text-sm">
                                <span className="font-bold text-slate-900">{exp.role}</span>
                                <span className="text-slate-500 text-xs">{exp.period}</span>
                              </div>
                              <div className="text-xs text-slate-600">{exp.organization}</div>
                              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-700 pl-1">
                                {exp.bulletPoints?.map((bp, bidx) => (
                                  <li key={bidx} className="leading-relaxed">
                                    {bp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Achievements */}
                    {resumeData.sections?.achievementsAndCertifications &&
                      resumeData.sections.achievementsAndCertifications.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1">
                            Honors, Certifications & Achievements
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-700 pl-1">
                            {resumeData.sections.achievementsAndCertifications.map((ach, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {ach}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ) : (
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {resumeData.formattedMarkdown}
                  </pre>
                )}
              </div>

              {/* ATS Tips Footer */}
              {resumeData.atsTips && resumeData.atsTips.length > 0 && (
                <div className="p-4 bg-blue-50/60 border-t border-blue-100 text-xs space-y-2">
                  <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    <span>Gemini ATS & Student Recruiter Tips:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-blue-950 pl-1">
                    {resumeData.atsTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-5 shadow-sm">
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Ready to Build Your Professional Resume
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Fill in your academic profile on the left or click any sample profile above to generate a formatted ATS-compliant resume in seconds.
                </p>
              </div>

              {/* Feature Showcase Graphic */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 max-w-lg mx-auto bg-slate-100">
                <img
                  src="/src/assets/images/resume_builder_showcase_1793948234571.jpg"
                  alt="Minimalist modern desk with neat student resume document"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-left text-xs text-white">
                  <span className="font-semibold">Clean Typography & ATS Parsing</span>
                  <p className="text-slate-300 text-[11px]">Formatted for college campus recruiting portals</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
