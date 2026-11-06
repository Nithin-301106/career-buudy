import React from 'react';
import { ActiveTab } from '../types/career';
import { Compass, GraduationCap, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                AI Career Buddy
              </span>
            </div>
            <p className="text-sm font-semibold text-blue-600">
              Discover Your Skills. Build Your Future.
            </p>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Personal career guidance platform designed for college students and recent graduates preparing for jobs, internships, interviews, and real-world opportunities. Powered by Google Gemini AI.
            </p>
          </div>

          {/* Tools Col 1 */}
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="font-bold text-slate-900">Career Tools</div>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button
                  onClick={() => onSelectTab('resume-builder')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  AI Resume Builder
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('interview-questions')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Interview Question Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('answer-improver')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Interview Answer Improver
                </button>
              </li>
            </ul>
          </div>

          {/* Tools Col 2 */}
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="font-bold text-slate-900">Pathways & Prep</div>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button
                  onClick={() => onSelectTab('career-guidance')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  AI Career Guidance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('skill-roadmap')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Skill Learning Roadmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('cover-letter')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Cover Letter Generator
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>Dedicated to student career readiness worldwide</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} AI Career Buddy. Practice questions for career self-preparation.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
