
import React from 'react';
import { UserLevel } from '../types';

interface Props {
  onSelect: (level: UserLevel) => void;
  onBack?: () => void;
}

const LevelSelectView: React.FC<Props> = ({ onSelect, onBack }) => {
  const levels = [
    { 
      id: UserLevel.STUDENT, 
      label: 'STUDENT', 
      desc: 'Just starting', 
      icon: 'school', 
      color: 'text-neon-cyan', 
      glow: 'bg-neon-cyan/40',
      pos: 'top-0 right-0' 
    },
    { 
      id: UserLevel.GRADUATE, 
      label: 'GRADUATE', 
      desc: 'Looking for jobs', 
      icon: 'workspace_premium', 
      color: 'text-neon-violet', 
      glow: 'bg-neon-violet/40',
      pos: 'top-44 left-0' 
    },
    { 
      id: UserLevel.PRO, 
      label: 'PRO', 
      desc: 'Already working', 
      icon: 'business_center', 
      color: 'text-blue-400', 
      glow: 'bg-blue-400/40',
      pos: 'top-[22rem] right-4' 
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative min-h-0">
      <div className="p-6 pt-24 pb-32 lg:p-10 lg:pt-16 lg:pb-10">
        <header className="mb-12 relative lg:max-w-3xl">
          {onBack && (
            <button
              onClick={onBack}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-mono tracking-[0.22em] uppercase text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Home
            </button>
          )}
          <div className="text-[10px] font-mono text-neon-cyan mb-2 tracking-[0.2em] uppercase opacity-70 animate-pulse">
            &gt; Welcome!
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white lg:text-6xl">
            Tell us about <br/>
            <span className="text-neon-cyan text-neon">yourself</span>
          </h1>
          <p className="mt-4 max-w-sm text-sm text-gray-400 leading-relaxed">
            Choose the path that matches where you are right now. You can come back here from home anytime.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-neon-cyan to-transparent mt-4"></div>
        </header>

        <div className="relative w-full mt-12 min-h-[600px] lg:grid lg:min-h-0 lg:grid-cols-3 lg:gap-6">
          {levels.map((level, idx) => (
            <div 
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`absolute ${level.pos} w-48 h-56 group cursor-pointer transform transition-all hover:scale-105 active:scale-95 z-10 lg:static lg:h-80 lg:w-full`}
            >
              <div className="glass-prism w-full h-full flex flex-col items-center justify-center relative overflow-hidden hover:bg-white/5">
                <div className={`absolute inset-0 bg-gradient-to-b ${level.color.replace('text', 'from')}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative z-10 mb-4 animate-float" style={{ animationDelay: `${idx * 0.5}s` }}>
                  <span className={`material-symbols-outlined text-6xl ${level.color} drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]`} style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>
                    {level.icon}
                  </span>
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 ${level.glow} blur-md rounded-full`}></div>
                </div>
                <div className="text-center relative z-10 mt-2">
                  <h3 className="text-white font-mono text-lg font-bold tracking-wider">{level.label}</h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-1 px-4">{level.desc}</p>
                </div>
              </div>
            </div>
          ))}

          <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-30 lg:hidden">
            <path className="animate-pulse" d="M100 100 L 100 200 L 50 250" fill="none" stroke="#00f0ff" strokeDasharray="4 4" strokeWidth="1"></path>
            <path className="animate-pulse" d="M250 150 L 250 250 L 200 300" fill="none" stroke="#8b5cf6" strokeDasharray="4 4" strokeWidth="1" style={{ animationDelay: '1s' }}></path>
            <circle cx="100" cy="100" fill="#00f0ff" r="3"></circle>
            <circle cx="250" cy="150" fill="#8b5cf6" r="3"></circle>
          </svg>
        </div>

        <div className="mt-12 w-full text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-black/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Waiting for you</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelectView;
