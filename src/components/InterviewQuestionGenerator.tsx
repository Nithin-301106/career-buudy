import React, { useState } from 'react';
import { POPULAR_ROLES } from '../data/sampleProfiles';
import { InterviewQuestionsResponse, InterviewQuestion, ActiveTab } from '../types/career';
import {
  HelpCircle,
  Sparkles,
  Loader2,
  Copy,
  Check,
  ArrowRight,
  BookOpen,
  Filter,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface InterviewQuestionGeneratorProps {
  onShowToast: (message: string, type?: 'success' | 'error') => void;
  onSendToAnswerImprover: (question: string, role: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const InterviewQuestionGenerator: React.FC<InterviewQuestionGeneratorProps> = ({
  onShowToast,
  onSendToAnswerImprover,
  onNavigateTab,
}) => {
  const [role, setRole] = useState(POPULAR_ROLES[0]);
  const [domain, setDomain] = useState('Software & Web Engineering');
  const [level, setLevel] = useState('College Internship / Entry-Level');
  const [filterType, setFilterType] = useState<'All' | 'Technical' | 'HR / Behavioral'>('All');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<InterviewQuestionsResponse | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!role.trim()) {
      setError('Please select or type a target job role.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/career/interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, domain, level }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Failed to generate interview questions.');
      }

      setData(resJson.data);
      onShowToast(`Generated 10 practice questions for ${role}!`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating questions.');
      onShowToast(err.message || 'Generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySingle = async (q: InterviewQuestion) => {
    const text = `Practice Question (${q.type}):\n${q.question}\n\nWhy Asked:\n${q.whyInterviewerAsks}\n\nKey Talking Points:\n${q.guidancePoints.map(p => '• ' + p).join('\n')}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(q.id);
      onShowToast('Question & guidance copied!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      onShowToast('Failed to copy', 'error');
    }
  };

  const handleCopyAll = async () => {
    if (!data) return;
    const allText = `10 PRACTICE INTERVIEW QUESTIONS FOR: ${data.role} (${level})\nDisclaimer: ${data.disclaimer}\n\n` +
      data.questions.map((q, idx) => (
        `#${idx + 1} [${q.type}] ${q.question}\nWhy Interviewers Ask: ${q.whyInterviewerAsks}\nTalking Points:\n${q.guidancePoints.map(p => '  - ' + p).join('\n')}\n`
      )).join('\n');

    try {
      await navigator.clipboard.writeText(allText);
      setCopiedAll(true);
      onShowToast('All 10 practice questions copied!');
      setTimeout(() => setCopiedAll(false), 2500);
    } catch {
      onShowToast('Failed to copy', 'error');
    }
  };

  const handlePracticeQuestion = (questionText: string) => {
    onSendToAnswerImprover(questionText, role);
    onNavigateTab('answer-improver');
    onShowToast('Question loaded into Answer Improver!');
  };

  const filteredQuestions = data
    ? data.questions.filter((q) => filterType === 'All' || q.type === filterType)
    : [];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Feature 02 · Interview Practice Generator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          10 Tailored Practice Interview Questions
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Prepare with confidence. Generate 10 targeted interview questions (balanced between technical foundations and HR behavioral situations) specifically suited for college students and recent grads.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            {/* Role input */}
            <div className="space-y-1.5 md:col-span-1">
              <label className="font-semibold text-slate-800 block">
                Target Role / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-900"
              />
            </div>

            {/* Domain */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Domain / Industry Track
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-900 bg-white"
              >
                <option value="Software & Web Engineering">Software & Web Engineering</option>
                <option value="Data Science & Machine Learning">Data Science & Machine Learning</option>
                <option value="Product Management & UX">Product Management & UX</option>
                <option value="Cloud, DevOps & IT">Cloud, DevOps & IT</option>
                <option value="Finance & Investment Banking">Finance & Investment Banking</option>
                <option value="Digital Marketing & Growth">Digital Marketing & Growth</option>
                <option value="Healthcare & BioTech">Healthcare & BioTech</option>
                <option value="General Professional">General Professional</option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Target Experience Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-900 bg-white"
              >
                <option value="College Internship">College Internship</option>
                <option value="College Internship / Entry-Level">College Internship / Entry-Level</option>
                <option value="Recent Graduate Fresher (0-1 yrs)">Recent Graduate Fresher (0-1 yrs)</option>
                <option value="Campus Placement Round">Campus Placement Round</option>
              </select>
            </div>
          </div>

          {/* Quick Role Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-slate-500 font-medium mr-1">Quick Select:</span>
            {POPULAR_ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  role === r
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-200">
              {error}
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating 10 Practice Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 10 Practice Questions</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Questions View */}
      {data && (
        <div className="space-y-6">
          {/* Top Bar with Filter & Copy All */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filter By Category:</span>
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs">
                {(['All', 'Technical', 'HR / Behavioral'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterType(cat)}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                      filterType === cat
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">All Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All 10 Questions</span>
                </>
              )}
            </button>
          </div>

          {/* Questions List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-indigo-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-slate-700">
                      {q.type}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500">{q.difficulty} Level</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopySingle(q)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      title="Copy question and talking points"
                    >
                      {copiedId === q.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handlePracticeQuestion(q.question)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                    >
                      <span>Practice Answer</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {q.question}
                  </h4>
                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <div className="font-semibold text-slate-700 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-indigo-500" />
                      <span>What the Interviewer Is Looking For:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{q.whyInterviewerAsks}</p>
                  </div>
                </div>

                {q.guidancePoints && q.guidancePoints.length > 0 && (
                  <div className="space-y-1 text-xs">
                    <div className="font-semibold text-slate-700">Recommended Talking Points:</div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                      {q.guidancePoints.map((pt, pidx) => (
                        <li key={pidx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Preparation Strategy Banner */}
          {data.preparationStrategy && (
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 text-xs sm:text-sm text-slate-800 space-y-2">
              <div className="font-bold text-indigo-950 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Interviewer Strategy Tip for Students:</span>
              </div>
              <p className="leading-relaxed text-slate-700">{data.preparationStrategy}</p>
              <div className="text-xs text-slate-500 italic pt-1">
                Notice: {data.disclaimer}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State Showcase */}
      {!data && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-slate-900">
              Practice Realistic Interview Rounds
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Select your domain and role above, then generate 10 tailored questions. You can practice your answers in our STAR-based answer improver.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
