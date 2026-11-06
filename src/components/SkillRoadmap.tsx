import React, { useState, useEffect } from 'react';
import { SkillRoadmapResponse, RoadmapStage } from '../types/career';
import {
  MapPin,
  Sparkles,
  Loader2,
  CheckCircle2,
  Circle,
  BookOpen,
  FolderGit2,
  Calendar,
  Award,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SkillRoadmapProps {
  initialSkill?: string;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const SkillRoadmap: React.FC<SkillRoadmapProps> = ({
  initialSkill = '',
  onShowToast,
}) => {
  const [careerOrSkill, setCareerOrSkill] = useState(
    initialSkill || 'Full Stack Web Development (React & Node.js)'
  );
  const [currentLevel, setCurrentLevel] = useState('Beginner');
  const [timeframe, setTimeframe] = useState('3 Months Semester Track');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SkillRoadmapResponse | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialSkill) {
      setCareerOrSkill(initialSkill);
    }
  }, [initialSkill]);

  const toggleTopic = (topicKey: string) => {
    setCompletedTopics((prev) => {
      const updated = { ...prev, [topicKey]: !prev[topicKey] };
      if (updated[topicKey]) {
        try {
          confetti({
            particleCount: 25,
            spread: 40,
            origin: { y: 0.8 },
          });
        } catch {
          // Fallback
        }
      }
      return updated;
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerOrSkill.trim()) {
      setError('Please specify the career role or skill you want to learn.');
      return;
    }

    setLoading(true);
    setError(null);
    setCompletedTopics({});

    try {
      const response = await fetch('/api/career/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerOrSkill,
          currentLevel,
          timeframe,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Failed to generate skill roadmap.');
      }

      setData(resJson.data);
      onShowToast(`Roadmap for ${careerOrSkill} generated!`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the roadmap.');
      onShowToast(err.message || 'Generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const popularSkills = [
    'Full Stack Web Development',
    'Machine Learning & Python',
    'Cloud Architecture & DevOps',
    'UI/UX Product Design',
    'Data Analytics & SQL',
    'Cybersecurity Fundamentals',
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-600 uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>Feature 05 · Structured Learning Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Step-by-Step Skill Learning Roadmap
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Master any tech stack, tool, or career discipline with a phased blueprint divided into <strong>Beginner</strong>, <strong>Intermediate</strong>, and <strong>Advanced</strong> milestones with portfolio project deliverables and free resources.
        </p>
      </div>

      {/* Inputs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleGenerate} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 md:col-span-1">
              <label className="font-semibold text-slate-800 block">
                Target Skill or Career <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={careerOrSkill}
                onChange={(e) => setCareerOrSkill(e.target.value)}
                placeholder="e.g. Full Stack Web Development"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">Your Current Level</label>
              <select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all text-slate-900 bg-white"
              >
                <option value="Complete Beginner">Complete Beginner</option>
                <option value="Some Basic Knowledge">Some Basic Knowledge</option>
                <option value="Transitioning from Another Field">Transitioning from Another Field</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">Target Timeline</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all text-slate-900 bg-white"
              >
                <option value="1 Month Intensive (Summer / Winter Break)">1 Month Intensive (Summer / Winter Break)</option>
                <option value="3 Months Semester Track">3 Months Semester Track</option>
                <option value="6 Months Deep Dive">6 Months Deep Dive</option>
              </select>
            </div>
          </div>

          {/* Quick Select Skills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-slate-500 font-medium mr-1">Popular Tracks:</span>
            {popularSkills.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setCareerOrSkill(s)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  careerOrSkill.startsWith(s)
                    ? 'bg-violet-50 text-violet-700 border-violet-200 font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-200">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Step-by-Step Curriculum...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Skill Roadmap</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Roadmap Output */}
      {data && (
        <div className="space-y-8">
          {/* Overview Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Curriculum Outline</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-violet-600">{data.estimatedDuration}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{data.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                {data.description}
              </p>
            </div>
          </div>

          {/* 3 Stages Timeline */}
          <div className="space-y-6">
            {data.stages.map((stg, sIdx) => {
              const stageColors = {
                Beginner: {
                  badge: 'bg-blue-50 text-blue-700 border-blue-200',
                  accent: 'border-l-blue-500',
                  dot: 'bg-blue-500',
                },
                Intermediate: {
                  badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                  accent: 'border-l-indigo-500',
                  dot: 'bg-indigo-500',
                },
                Advanced: {
                  badge: 'bg-purple-50 text-purple-700 border-purple-200',
                  accent: 'border-l-purple-500',
                  dot: 'bg-purple-500',
                },
              }[stg.stage] || {
                badge: 'bg-slate-50 text-slate-700 border-slate-200',
                accent: 'border-l-slate-500',
                dot: 'bg-slate-500',
              };

              return (
                <div
                  key={sIdx}
                  className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6 hover:shadow-md transition-shadow"
                >
                  {/* Stage Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm font-mono">
                        {sIdx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-slate-900">
                            {stg.stage} Stage
                          </h4>
                          <span className="text-xs text-slate-500 font-mono">
                            ({stg.duration})
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Goal: {stg.goal}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Topics to Master Checklist */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Core Topics to Master (Click to track progress):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {stg.topics.map((tpc, tIdx) => {
                        const key = `${stg.stage}-${tIdx}`;
                        const isDone = completedTopics[key];
                        return (
                          <button
                            key={tIdx}
                            type="button"
                            onClick={() => toggleTopic(key)}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                              isDone
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            )}
                            <span className={isDone ? 'line-through text-slate-500' : ''}>
                              {tpc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hands-on Projects */}
                  {stg.projects && stg.projects.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-violet-600" />
                        <span>Recommended Hands-on Projects:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {stg.projects.map((proj, pIdx) => (
                          <div
                            key={pIdx}
                            className="p-3.5 bg-violet-50/50 rounded-xl border border-violet-100 space-y-1.5"
                          >
                            <span className="font-bold text-violet-950 block text-xs sm:text-sm">
                              {proj.name}
                            </span>
                            <p className="text-slate-600 leading-relaxed">
                              {proj.description}
                            </p>
                            {proj.deliverables && (
                              <div className="text-[11px] text-violet-900 pt-1 border-t border-violet-200/50">
                                <strong>Deliverable: </strong>
                                <span>{proj.deliverables}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Free Curated Resources */}
                  {stg.freeResources && stg.freeResources.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>Free & Open Learning Resources:</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {stg.freeResources.map((res, rIdx) => (
                          <div
                            key={rIdx}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                          >
                            <span className="font-semibold text-slate-900">{res.name}</span>
                            <span className="text-slate-400 mx-1">·</span>
                            <span className="text-slate-500">{res.type}</span>
                            {res.notes && <span className="text-slate-600 ml-1">({res.notes})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Capstone Project Card */}
          {data.capstoneProject && (
            <div className="bg-gradient-to-r from-violet-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 border border-violet-800/40 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-violet-300 uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Resume-Ready Capstone Project Spotlight</span>
              </div>
              <h4 className="text-xl font-extrabold text-white">
                {data.capstoneProject.title}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {data.capstoneProject.summary}
              </p>
              {data.capstoneProject.resumeBulletPointExample && (
                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs space-y-1">
                  <span className="text-violet-200 font-semibold block">
                    How to format this on your college resume:
                  </span>
                  <p className="text-white italic">
                    "{data.capstoneProject.resumeBulletPointExample}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Mentor Tips */}
          {data.mentorTips && data.mentorTips.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2 text-xs sm:text-sm">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-violet-600" />
                <span>Student Study & Consistency Tips:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                {data.mentorTips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!data && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-slate-900">
              Clear Roadmap to Mastery
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Choose your target skill or career track above to generate a phased 3-stage learning curriculum with free resources and resume project ideas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
