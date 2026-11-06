import React, { useState } from 'react';
import { SAMPLE_CAREER_GUIDANCE_PRESETS } from '../data/sampleProfiles';
import { CareerGuidanceResponse, CareerPath, ActiveTab } from '../types/career';
import {
  Compass,
  Sparkles,
  Loader2,
  ArrowRight,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Calendar,
  Layers,
  BookOpen,
} from 'lucide-react';

interface CareerGuidanceProps {
  onShowToast: (message: string, type?: 'success' | 'error') => void;
  onSendToRoadmap: (skillOrCareer: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const CareerGuidance: React.FC<CareerGuidanceProps> = ({
  onShowToast,
  onSendToRoadmap,
  onNavigateTab,
}) => {
  const [degree, setDegree] = useState(
    'B.S. in Computer Science / Information Tech'
  );
  const [interests, setInterests] = useState(
    SAMPLE_CAREER_GUIDANCE_PRESETS[0].interests
  );
  const [skills, setSkills] = useState(
    SAMPLE_CAREER_GUIDANCE_PRESETS[0].skills
  );
  const [favoriteSubjects, setFavoriteSubjects] = useState(
    SAMPLE_CAREER_GUIDANCE_PRESETS[0].favoriteSubjects
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CareerGuidanceResponse | null>(null);

  const handleSelectPreset = (preset: (typeof SAMPLE_CAREER_GUIDANCE_PRESETS)[0]) => {
    setDegree(preset.degree);
    setInterests(preset.interests);
    setSkills(preset.skills);
    setFavoriteSubjects(preset.favoriteSubjects);
    onShowToast(`Loaded ${preset.label} preset!`);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interests.trim() && !skills.trim() && !favoriteSubjects.trim()) {
      setError('Please provide at least your interests, current skills, or favorite subjects.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/career/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interests,
          skills,
          favoriteSubjects,
          degree,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Failed to generate career guidance.');
      }

      setData(resJson.data);
      onShowToast('Personalized career guidance generated!');
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating career guidance.');
      onShowToast(err.message || 'Generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoadmapForCareer = (careerTitle: string) => {
    onSendToRoadmap(careerTitle);
    onNavigateTab('skill-roadmap');
    onShowToast(`Loaded "${careerTitle}" into Learning Roadmap!`);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Feature 04 · Academic to Industry Navigator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            AI Career Guidance & Pathway Matcher
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Wondering what to do with your major? Tell us what you enjoy, your favorite college subjects, and skills. Gemini AI will match you with high-potential career tracks and practical entry points.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0">
          <div className="text-xs font-semibold text-slate-700 mb-2">
            Try Preset Student Profiles:
          </div>
          <div className="flex flex-col gap-1.5">
            {SAMPLE_CAREER_GUIDANCE_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="text-left px-2.5 py-1.5 text-xs text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50 rounded-md border border-slate-200 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Your Academic & Passion Profile
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Current Degree / Major
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.S. in Computer Science"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                What are your main interests and passions? <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g. Building intuitive web experiences, organizing events, automated data charts, solving puzzles"
                required
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Current Skills (Technical or General)
              </label>
              <textarea
                rows={2}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Python, basic JavaScript, public speaking, Figma, critical analysis"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 block">
                Favorite Academic Subjects <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={favoriteSubjects}
                onChange={(e) => setFavoriteSubjects(e.target.value)}
                placeholder="e.g. Human-Computer Interaction, Statistics, Macroeconomics, Psychology"
                required
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
                  <span>Evaluating Career Paths...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Suggest Career Paths</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          {data ? (
            <div className="space-y-6">
              {/* Encouraging Summary */}
              {data.summary && (
                <div className="bg-blue-50/70 rounded-2xl p-5 border border-blue-100 text-slate-800 text-xs sm:text-sm leading-relaxed">
                  <div className="font-bold text-blue-900 mb-1">Counselor Overview:</div>
                  <p>{data.summary}</p>
                </div>
              )}

              {/* Career Path Cards */}
              <div className="space-y-4">
                {data.careerPaths.map((cp, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-400">
                            Pathway 0{idx + 1}
                          </span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="text-xs text-blue-600 font-semibold">{cp.tagline}</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mt-1">
                          {cp.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleCreateRoadmapForCareer(cp.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap self-start"
                      >
                        <span>Generate Roadmap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <strong className="text-slate-900">Why It Fits You: </strong>
                      <span>{cp.whyItFits}</span>
                    </div>

                    {/* Entry Roles & Core Skills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <strong className="text-slate-900 block flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                          <span>Entry-Level Roles:</span>
                        </strong>
                        <p className="text-slate-600 leading-relaxed">
                          {cp.entryRoles?.join(', ')}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <strong className="text-slate-900 block flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Key Skills Needed:</span>
                        </strong>
                        <p className="text-slate-600 leading-relaxed">
                          {cp.coreSkills?.join(', ')}
                        </p>
                      </div>
                    </div>

                    {/* Qualifications and Day In Life */}
                    <div className="space-y-2 text-xs pt-1 border-t border-slate-100">
                      {cp.qualifications && (
                        <div className="text-slate-600">
                          <span className="font-semibold text-slate-800">Recommended Qualifications: </span>
                          <span>{cp.qualifications.join(' · ')}</span>
                        </div>
                      )}
                      {cp.dayInTheLife && (
                        <div className="text-slate-600">
                          <span className="font-semibold text-slate-800">Day in the Life: </span>
                          <span>{cp.dayInTheLife}</span>
                        </div>
                      )}
                      {cp.growthTrajectory && (
                        <div className="text-slate-500 italic">
                          Career Trajectory: {cp.growthTrajectory}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 30-Day Action Plan */}
              {data.actionPlan30Days && data.actionPlan30Days.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Your Recommended 30-Day Action Plan</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {data.actionPlan30Days.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="font-bold text-blue-700">{item.week} - {item.focus}</span>
                        <p className="text-slate-600 leading-relaxed">{item.task}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-5 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Compass className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Discover Where Your Degree Can Take You
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Enter your interests and favorite college subjects to receive actionable career pathways with realistic entry-level roles and skill prerequisites.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
