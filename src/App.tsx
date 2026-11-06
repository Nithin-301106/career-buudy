import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types/career';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResumeBuilder } from './components/ResumeBuilder';
import { InterviewQuestionGenerator } from './components/InterviewQuestionGenerator';
import { InterviewAnswerImprover } from './components/InterviewAnswerImprover';
import { CareerGuidance } from './components/CareerGuidance';
import { SkillRoadmap } from './components/SkillRoadmap';
import { CoverLetterGenerator } from './components/CoverLetterGenerator';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import {
  FileText,
  HelpCircle,
  Wand2,
  Compass,
  MapPin,
  Send,
  Home,
  AlertTriangle,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Shared state between tools
  const [selectedPracticeQuestion, setSelectedPracticeQuestion] = useState('');
  const [selectedPracticeRole, setSelectedPracticeRole] = useState('');
  const [selectedRoadmapSkill, setSelectedRoadmapSkill] = useState('');

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Server health state
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (!data.hasApiKey) {
          setApiKeyMissing(true);
        }
      })
      .catch((err) => {
        console.warn('Health check warning:', err);
      });
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3500);
  };

  const handleSendToAnswerImprover = (question: string, role: string) => {
    setSelectedPracticeQuestion(question);
    setSelectedPracticeRole(role);
  };

  const handleSendToRoadmap = (skillOrCareer: string) => {
    setSelectedRoadmapSkill(skillOrCareer);
  };

  const tabsConfig = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: Home },
    { id: 'resume-builder' as ActiveTab, label: 'Resume Builder', icon: FileText },
    { id: 'interview-questions' as ActiveTab, label: 'Interview Questions', icon: HelpCircle },
    { id: 'answer-improver' as ActiveTab, label: 'Answer Improver', icon: Wand2 },
    { id: 'career-guidance' as ActiveTab, label: 'Career Guidance', icon: Compass },
    { id: 'skill-roadmap' as ActiveTab, label: 'Skill Roadmap', icon: MapPin },
    { id: 'cover-letter' as ActiveTab, label: 'Cover Letter', icon: Send },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar Header */}
      <Header activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* API Key notice banner if not set in secrets */}
      {apiKeyMissing && (
        <div className="bg-amber-500 text-white px-4 py-2.5 text-xs text-center font-medium flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            API Key not found in environment. Please ensure GEMINI_API_KEY is configured in your AI Studio Secrets panel.
          </span>
        </div>
      )}

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Secondary Tab Strip for fast tab hopping on any device */}
        {activeTab !== 'overview' && (
          <div className="mb-6 overflow-x-auto pb-1 scrollbar-none">
            <div className="inline-flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              {tabsConfig.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Active Tab View */}
        {activeTab === 'overview' && <Hero onSelectTab={setActiveTab} />}

        {activeTab === 'resume-builder' && (
          <ResumeBuilder onShowToast={showToast} />
        )}

        {activeTab === 'interview-questions' && (
          <InterviewQuestionGenerator
            onShowToast={showToast}
            onSendToAnswerImprover={handleSendToAnswerImprover}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'answer-improver' && (
          <InterviewAnswerImprover
            initialQuestion={selectedPracticeQuestion}
            initialRole={selectedPracticeRole}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'career-guidance' && (
          <CareerGuidance
            onShowToast={showToast}
            onSendToRoadmap={handleSendToRoadmap}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'skill-roadmap' && (
          <SkillRoadmap
            initialSkill={selectedRoadmapSkill}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'cover-letter' && (
          <CoverLetterGenerator onShowToast={showToast} />
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />
    </div>
  );
}
