import React from 'react';
import { ActiveTab } from '../types/career';
import { Sparkles, Compass } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-2.5 text-left text-slate-900 hover:text-blue-600 transition-colors shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight whitespace-nowrap">
            AI Career Buddy
          </span>
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'overview'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectTab('resume-builder')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'resume-builder'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            Resume Builder
          </button>
          <button
            onClick={() => onSelectTab('interview-questions')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'interview-questions'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            Interview Questions
          </button>
          <button
            onClick={() => onSelectTab('answer-improver')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'answer-improver'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            Answer Improver
          </button>
          <button
            onClick={() => onSelectTab('career-guidance')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'career-guidance'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            Career Guidance
          </button>
          <button
            onClick={() => onSelectTab('skill-roadmap')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'skill-roadmap'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            Skill Roadmap
          </button>
          <button
            onClick={() => onSelectTab('cover-letter')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'cover-letter'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            Cover Letter
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('resume-builder')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm hover:shadow-md whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Build Resume Draft</span>
          </button>
        </div>
      </div>
    </header>
  );
};
