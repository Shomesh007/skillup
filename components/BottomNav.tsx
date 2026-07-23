
import React from 'react';
import { AppView } from '../types';

interface Props {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const BottomNav: React.FC<Props> = ({ currentView, onViewChange }) => {
  const items = [
    { view: AppView.PROFILE_HUB, icon: 'hub', label: 'DASHBOARD' },
    { view: AppView.ROLE_HUB, icon: 'explore', label: 'GUIDES' },
    { view: AppView.AI_CHAT, icon: 'forum', label: 'ASSISTANT' },
    { view: AppView.RESUME_TEMPLATES, icon: 'badge', label: 'RESUME' },
    { view: AppView.JOB_LIST, icon: 'search', label: 'JOBS' },
  ];

  return (
    <nav className="absolute bottom-0 w-full glass-panel border-t border-white/10 flex justify-around items-center h-16 pb-2 z-50 lg:hidden">
      {items.map((item) => (
        <button 
          key={item.view}
          onClick={() => onViewChange(item.view)}
          className={`flex flex-col items-center gap-1 group relative ${currentView === item.view ? 'text-neon-cyan' : 'text-gray-500'}`}
        >
          <span className={`material-symbols-outlined text-2xl ${currentView === item.view ? 'text-neon transition-all' : ''}`}>
            {item.icon}
          </span>
          <span className="text-[9px] font-mono tracking-widest">{item.label}</span>
          {currentView === item.view && (
            <span className="absolute -bottom-1 w-1 h-1 bg-neon-cyan rounded-full shadow-[0_0_5px_rgba(0,240,255,1)]"></span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
