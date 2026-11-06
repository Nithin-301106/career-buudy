import React, { useState } from 'react';
import { ActiveTab } from '../types/career';
import { Sparkles, Compass, Menu, X, FileText, HelpCircle, Wand2, MapPin, Send, Home } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelect = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: Home },
    { id: 'resume-builder' as ActiveTab, label: 'Resume Builder', icon: FileText },
    { id: 'interview-questions' as ActiveTab, label: 'Interview Questions', icon: HelpCircle },
    { id: 'answer-improver' as ActiveTab, label: 'Answer Improver', icon: Wand2 },
    { id: 'career-guidance' as ActiveTab, label: 'Career Guidance', icon: Compass },
    { id: 'skill-roadmap' as ActiveTab, label: 'Skill Roadmap', icon: MapPin },
    { id: 'cover-letter' as ActiveTab, label: 'Cover Letter', icon: Send },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => handleSelect('overview')}
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
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === item.id
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : 'hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action + mobile hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => handleSelect('resume-builder')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm hover:shadow-md whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Build Resume Draft</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-2 pb-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleSelect('resume-builder')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Build Resume Draft</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
