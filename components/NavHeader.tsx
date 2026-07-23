
import React from 'react';
import { AppView, UserLevel } from '../types';

interface Props {
  level: UserLevel | null;
  role: string | null;
  company?: string;
  view: AppView;
  onBack?: () => void;
  onLogout: () => void;
}

const NavHeader: React.FC<Props> = ({ level, role, company, view, onBack, onLogout }) => {
  const getTitle = () => {
    switch (view) {
      case AppView.ROLE_HUB: return "Job Guides";
      case AppView.COMPANY_DISCOVERY: return "Companies";
      case AppView.COMPANY_PROFILE: return "Company Profile";
      case AppView.GUIDE: return "How to Apply";
      case AppView.RESUME_TEMPLATES: return "Resume Templates";
      case AppView.INTERVIEW_PREP: return "Interview Prep";
      case AppView.SUCCESS_STORIES: return "Success Stories";
      case AppView.JOB_LIST: return "Available Jobs";
      case AppView.AI_CHAT: return "Easy Assistant";
      case AppView.LIVE_COACHING: return "Live Coaching";
      case AppView.PROFILE_HUB: return "Dashboard";
      default: return "";
    }
  };

  return (
    <div className="shrink-0 z-40 bg-background-dark/80 backdrop-blur-xl border-b border-white/5 pt-10 pb-4 px-6 lg:pt-5 lg:pb-5 lg:px-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-neon-cyan/10 hover:border-neon-cyan/50 transition-all group"
            >
              <span className="material-symbols-outlined text-gray-400 group-hover:text-neon-cyan transition-colors">arrow_back</span>
            </button>
          )}
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight lg:text-2xl">{getTitle()}</h2>
            <p className="hidden lg:block text-[10px] font-mono uppercase tracking-[0.24em] text-gray-600">
              {[level, role, company].filter(Boolean).join(' / ') || 's4skillup workspace'}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest text-gray-400 transition-colors hover:border-neon-cyan/40 hover:bg-neon-cyan/10 hover:text-neon-cyan"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default NavHeader;
