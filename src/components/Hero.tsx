import React from 'react';
import { ActiveTab } from '../types/career';
import {
  FileText,
  HelpCircle,
  Wand2,
  Compass,
  MapPin,
  Send,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface HeroProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectTab }) => {
  const features = [
    {
      id: 'resume-builder' as ActiveTab,
      title: 'AI Resume Builder',
      description:
        'Transform your university coursework, student projects, and skills into an ATS-friendly, professional resume draft.',
      icon: FileText,
      gradient: 'from-blue-600 to-indigo-600',
      actionText: 'Build My Resume',
      badge: 'Step 1: Get Prepared',
    },
    {
      id: 'interview-questions' as ActiveTab,
      title: 'Interview Question Generator',
      description:
        'Generate 10 tailored practice questions (both technical & HR) for any entry-level role or internship domain.',
      icon: HelpCircle,
      gradient: 'from-indigo-600 to-purple-600',
      actionText: 'Generate Questions',
      badge: 'Step 2: Practice',
    },
    {
      id: 'answer-improver' as ActiveTab,
      title: 'Interview Answer Improver',
      description:
        'Sharpen your draft answers using the STAR method. Enhance clarity, confidence, and grammatical impact.',
      icon: Wand2,
      gradient: 'from-purple-600 to-pink-600',
      actionText: 'Improve My Answer',
      badge: 'Step 3: Refine',
    },
    {
      id: 'career-guidance' as ActiveTab,
      title: 'AI Career Guidance',
      description:
        'Match your personal interests, favorite college subjects, and skills with high-potential career pathways.',
      icon: Compass,
      gradient: 'from-blue-600 to-cyan-600',
      actionText: 'Discover Careers',
      badge: 'Explore Opportunities',
    },
    {
      id: 'skill-roadmap' as ActiveTab,
      title: 'Skill Learning Roadmap',
      description:
        'Break down any tech or domain skill into Beginner, Intermediate, and Advanced milestones with free resources.',
      icon: MapPin,
      gradient: 'from-violet-600 to-purple-700',
      actionText: 'View Roadmaps',
      badge: 'Self-Paced Learning',
    },
    {
      id: 'cover-letter' as ActiveTab,
      title: 'Cover Letter Generator',
      description:
        'Craft an authentic, compelling cover letter that highlights your college projects and enthusiasm for the company.',
      icon: Send,
      gradient: 'from-indigo-600 to-blue-700',
      actionText: 'Write Cover Letter',
      badge: 'Apply Confidently',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-blue-800/40">
        {/* Subtle decorative glow accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Callouts */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Campus to Career Launchpad</span>
              <span aria-hidden="true" className="text-blue-500">·</span>
              <span className="text-slate-300">Powered by Gemini AI</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                AI Career Buddy
              </h1>
              <p className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-200 via-purple-200 to-white bg-clip-text text-transparent">
                Discover Your Skills. Build Your Future.
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Your comprehensive, all-in-one career assistant built specifically for college students and recent grads. Build ATS-ready resumes, practice real interview questions, improve answers with STAR methodology, and map out your roadmap to dream internships and jobs.
            </p>

            {/* Quick Proof & Value Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Student-First & Free</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>No Fake Credentials</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                <span>One-Click Copy & Export</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3.5 pt-4">
              <button
                onClick={() => onSelectTab('resume-builder')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-purple-500/30 text-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span>Generate Resume Draft</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectTab('interview-questions')}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/15 transition-all text-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span>Practice Interview Questions</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-blue-400/20 shadow-2xl bg-slate-800">
              <img
                src="/src/assets/images/hero_career_students_1793948234269.jpg"
                alt="Diverse university students collaborating on tech and career roadmaps in campus innovation hub"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 lg:h-96 object-cover hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  // Resilient styled fallback container per zero-broken-image policy
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-200">
                <span className="font-semibold text-white">Campus Peer Cohort</span>
                <span className="mx-1.5">·</span>
                <span>Active Resume & Interview Prep</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Feature Cards Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              Complete Career Toolkit
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Six Dedicated AI Career Tools
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Engineered with prompt precision to help you navigate every stage of your college-to-career journey.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            <span>6 of 6 Tools Active</span>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <button
                    onClick={() => onSelectTab(feat.id)}
                    className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 text-sm font-semibold transition-colors group-hover:border-blue-200 border border-slate-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <span>{feat.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* College Student Guidance & Ethics Note */}
      <section className="bg-slate-100 rounded-2xl p-6 border border-slate-200 text-slate-700 text-xs sm:text-sm space-y-2">
        <div className="font-semibold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Student Authenticity & Ethics Notice</span>
        </div>
        <p className="leading-relaxed text-slate-600">
          AI Career Buddy is built to empower college students to communicate their genuine academic achievements, coursework, and personal projects effectively. The tool does not fabricate fake work experiences or degrees, and does not guarantee job placements. All interview questions are intended for structured self-practice.
        </p>
      </section>
    </div>
  );
};
