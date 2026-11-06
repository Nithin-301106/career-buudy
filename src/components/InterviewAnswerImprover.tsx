import React, { useState, useEffect } from 'react';
import { SAMPLE_INTERVIEW_QUESTIONS } from '../data/sampleProfiles';
import { AnswerImproverResponse } from '../types/career';
import {
  Wand2,
  Sparkles,
  Loader2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Shield,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InterviewAnswerImproverProps {
  initialQuestion?: string;
  initialRole?: string;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const InterviewAnswerImprover: React.FC<InterviewAnswerImproverProps> = ({
  initialQuestion = '',
  initialRole = '',
  onShowToast,
}) => {
  const [question, setQuestion] = useState(
    initialQuestion || SAMPLE_INTERVIEW_QUESTIONS[1].question
  );
  const [userAnswer, setUserAnswer] = useState(
    SAMPLE_INTERVIEW_QUESTIONS[1].draftAnswer
  );
  const [role, setRole] = useState(
    initialRole || SAMPLE_INTERVIEW_QUESTIONS[1].role
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerImproverResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
    }
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialQuestion, initialRole]);

  const handleSelectSample = (sample: (typeof SAMPLE_INTERVIEW_QUESTIONS)[0]) => {
    setQuestion(sample.question);
    setUserAnswer(sample.draftAnswer);
    setRole(sample.role);
    setResult(null);
    onShowToast(`Loaded sample question for ${sample.role}!`);
  };

  const handleImprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !userAnswer.trim()) {
      setError('Please provide both the interview question and your draft answer.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/career/improve-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          userAnswer,
          role,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Failed to improve answer.');
      }

      setResult(resJson.data);
      onShowToast('Answer enhanced with STAR methodology!');
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {
        // Confetti fallback
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while enhancing your answer.');
      onShowToast(err.message || 'Enhancement failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyImprovedAnswer = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.improvedAnswer);
      setCopied(true);
      onShowToast('Improved answer copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Failed to copy', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider">
            <Wand2 className="w-4 h-4" />
            <span>Feature 03 · Answer Coaching & STAR Method</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Interview Answer Improver
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Write down your raw thoughts or draft interview answer. Gemini AI restructures your answer using the proven <strong>STAR formula</strong> (Situation, Task, Action, Result), polishes grammar, and sharpens professional impact.
          </p>
        </div>

        {/* Sample Answer Loader */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0">
          <div className="text-xs font-semibold text-slate-700 mb-2">
            Try Sample Student Answers:
          </div>
          <div className="flex flex-col gap-1.5">
            {SAMPLE_INTERVIEW_QUESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(s)}
                className="text-left px-2.5 py-1.5 text-xs text-slate-700 hover:text-purple-700 bg-white hover:bg-purple-50 rounded-md border border-slate-200 transition-colors truncate max-w-xs"
              >
                {s.question.slice(0, 42)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Question & Draft Answer */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Enter Interview Prompt & Answer
          </h3>

          <form onSubmit={handleImprove} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Target Role / Context (Optional)
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineering Intern"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Interview Question <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Tell me about a time you handled a difficult team conflict."
                required
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-slate-900 resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-800 block">
                  Your Draft Answer <span className="text-red-500">*</span>
                </label>
                <span className="text-slate-400 text-xs">
                  {userAnswer.length} chars
                </span>
              </div>
              <textarea
                rows={6}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your unedited draft here. Don't worry about perfect grammar or formal phrasing - speak from your honest college experience."
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-slate-900 resize-y leading-relaxed"
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
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enhancing with STAR Structure...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Improve & Structure My Answer</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Improved Answer & STAR Analysis */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Main Improved Answer Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                      Enhanced Version (STAR Method)
                    </span>
                  </div>

                  <button
                    onClick={copyImprovedAnswer}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-800 bg-white hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors shadow-2xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Improved Answer</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-slate-900 font-medium text-sm sm:text-base leading-relaxed p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                    "{result.improvedAnswer}"
                  </div>

                  {/* STAR Breakdown */}
                  {result.starMethod && (
                    <div className="space-y-3 pt-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        STAR Framework Deconstruction
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
                          <strong className="text-blue-900 block">S - Situation</strong>
                          <p className="text-blue-950 leading-relaxed">{result.starMethod.situation}</p>
                        </div>
                        <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1">
                          <strong className="text-indigo-900 block">T - Task</strong>
                          <p className="text-indigo-950 leading-relaxed">{result.starMethod.task}</p>
                        </div>
                        <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 space-y-1">
                          <strong className="text-purple-900 block">A - Action</strong>
                          <p className="text-purple-950 leading-relaxed">{result.starMethod.action}</p>
                        </div>
                        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
                          <strong className="text-emerald-900 block">R - Result</strong>
                          <p className="text-emerald-950 leading-relaxed">{result.starMethod.result}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Coaching Feedback Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Genuine Strengths */}
                {result.strengths && result.strengths.length > 0 && (
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                    <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Original Strengths</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pl-1">
                      {result.strengths.map((str, idx) => (
                        <li key={idx} className="leading-relaxed">{str}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specific Improvements Made */}
                {result.improvements && result.improvements.length > 0 && (
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                    <div className="text-xs font-bold text-indigo-700 flex items-center gap-1.5 uppercase tracking-wider">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <span>Key Improvements</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pl-1">
                      {result.improvements.map((imp, idx) => (
                        <li key={idx} className="leading-relaxed">{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Delivery Tips */}
              {result.deliveryTips && result.deliveryTips.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2 text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Vocal & Physical Delivery Tips:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                    {result.deliveryTips.map((tip, idx) => (
                      <li key={idx} className="leading-relaxed">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-5 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <Wand2 className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Ready to Polish Your Interview Story
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Enter an interview question and your draft answer on the left. Gemini AI will analyze your response and guide you into an articulate, confident delivery.
                </p>
              </div>

              {/* Mock interview photo */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 max-w-lg mx-auto bg-slate-100">
                <img
                  src="/src/assets/images/interview_practice_student_1793948234917.jpg"
                  alt="College student confidently taking a mock webcam interview"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-left text-xs text-white">
                  <span className="font-semibold">Constructive Confidence Coaching</span>
                  <p className="text-slate-300 text-[11px]">Structured for behavioral and technical interviews</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
