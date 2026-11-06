import React, { useState } from 'react';
import { CoverLetterResponse } from '../types/career';
import {
  Send,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Download,
  AlertCircle,
  FileCheck,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CoverLetterGeneratorProps {
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({
  onShowToast,
}) => {
  const [jobRole, setJobRole] = useState('Frontend Engineering Intern');
  const [companyName, setCompanyName] = useState('Stripe');
  const [studentName, setStudentName] = useState('Maya Patel');
  const [qualifications, setQualifications] = useState(
    'Junior in Computer Science at State University, GPA 3.8/4.0. Completed Advanced Web Applications and Algorithms.'
  );
  const [relevantExperiences, setRelevantExperiences] = useState(
    'Built "StudySquad" peer tutoring platform in React & Node.js used by 200+ students. Passionate about developer tooling, API design, and clean user interfaces.'
  );
  const [tone, setTone] = useState<'Enthusiastic & Professional' | 'Direct & Impact-Driven' | 'Warm & Collaborative'>(
    'Enthusiastic & Professional'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CoverLetterResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobRole.trim() || !companyName.trim() || !studentName.trim()) {
      setError('Please provide the Job Role, Company Name, and your Student Name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/career/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobRole,
          companyName,
          studentName,
          qualifications,
          relevantExperiences,
          tone,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Failed to generate cover letter.');
      }

      setData(resJson.data);
      onShowToast(`Cover letter for ${companyName} generated!`);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {
        // Fallback
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the cover letter.');
      onShowToast(err.message || 'Generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyCoverLetter = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.coverLetter);
      setCopied(true);
      onShowToast('Cover letter copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Failed to copy', 'error');
    }
  };

  const downloadCoverLetter = () => {
    if (!data) return;
    const blob = new Blob([data.coverLetter], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studentName.replace(/\s+/g, '_')}_Cover_Letter_${companyName.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Cover letter downloaded as Markdown file!');
  };

  const loadSample = () => {
    setJobRole('Data Analyst Intern');
    setCompanyName('Spotify');
    setStudentName('Liam Reynolds');
    setQualifications('Senior Data Science & Applied Statistics student at Metro University with Google Data Analytics Certification.');
    setRelevantExperiences('Analyzed 10,000+ survey rows for economics research faculty; built predictive models on open transit datasets achieving 84% accuracy.');
    setTone('Direct & Impact-Driven');
    onShowToast('Loaded sample Spotify application profile!');
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            <Send className="w-4 h-4" />
            <span>Feature 06 · Tailored Application Letter</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            AI Cover Letter Generator
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Generate an authentic, persuasive cover letter tailored to a specific company and role. Highlights your university coursework, student projects, and genuine enthusiasm without fluff.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSample}
          className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors shrink-0"
        >
          Load Sample Application
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Application Details
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Maya Patel"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">
                  Target Job Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Frontend Intern"
                  required
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe, Google, Local Startup"
                  required
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">Tone & Style</label>
              <select
                value={tone}
                onChange={(e: any) => setTone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 bg-white text-xs sm:text-sm"
              >
                <option value="Enthusiastic & Professional">Enthusiastic & Professional</option>
                <option value="Direct & Impact-Driven">Direct & Impact-Driven</option>
                <option value="Warm & Collaborative">Warm & Collaborative</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Academic Background & Qualifications
              </label>
              <textarea
                rows={2}
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="Major, university, year of study, relevant coursework"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Key Projects or Experiences to Highlight
              </label>
              <textarea
                rows={3}
                value={relevantExperiences}
                onChange={(e) => setRelevantExperiences(e.target.value)}
                placeholder="Specific student project, hackathon, or internship experience to tie directly to the role"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 resize-y"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting Tailored Cover Letter...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Cover Letter</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          {data ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-900">
                    Cover Letter for {companyName}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{jobRole}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyCoverLetter}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Letter</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={downloadCoverLetter}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Subject Line */}
                {data.subjectLine && (
                  <div className="text-xs sm:text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3">
                    <span className="text-slate-400 font-normal">Subject: </span>
                    {data.subjectLine}
                  </div>
                )}

                {/* Formatted Letter Body */}
                <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans max-h-[600px] overflow-y-auto pr-2">
                  {data.coverLetter}
                </div>

                {/* Key Highlights */}
                {data.keyHighlights && data.keyHighlights.length > 0 && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                      <span>Standout Strengths Highlighted:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                      {data.keyHighlights.map((hl, idx) => (
                        <li key={idx}>{hl}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tailoring Advice */}
                {data.customizationAdvice && (
                  <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-1">
                    <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>Before You Submit to {companyName}:</span>
                    </div>
                    <p className="text-amber-950 leading-relaxed">{data.customizationAdvice}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-5 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Send className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Targeted Student Cover Letters
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Enter your target company, role, and key project highlights on the left to generate an authentic cover letter ready to copy or download.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
