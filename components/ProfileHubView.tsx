
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { AppView } from '../types';

interface Props {
  onSelectModule: (mod: AppView) => void;
  onBack: () => void;
}

const ProfileHubView: React.FC<Props> = ({ onSelectModule, onBack }) => {
  const { user, selectedCompany } = useAppContext();

  const handleProtectedNav = (view: AppView) => {
    onSelectModule(view);
  };

  return (
    <div className="flex-1 h-full flex flex-col p-6 pt-4 overflow-y-auto no-scrollbar relative pb-32 lg:p-8 lg:pb-8">
      <header className="mb-8 shrink-0 lg:mb-10">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative w-20 h-20 flex-shrink-0">
            <div className="absolute inset-0 bg-neon-cyan/20 blur-xl rounded-full animate-pulse-glow"></div>
            <div className="relative w-full h-full rounded-2xl bg-white border border-neon-cyan/50 flex items-center justify-center backdrop-blur-sm ">
              <span className="text-3xl font-bold font-display text-ink ">{user?.email?.[0]?.toUpperCase() || '👤'}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-mono text-neon-cyan tracking-wider">ACTIVE</span>
            </div>
            <h1 className="text-xl font-bold text-ink leading-tight lg:text-3xl">
              {selectedCompany ? `Preparing for ${selectedCompany.name}` : 'Your Career Dashboard'}
              <br />
              <span className="text-primary bg-blue-50  ">Plan. Prepare. Win.</span>
            </h1>
          </div>
        </div>
      </header>

      <section className="mb-8 relative py-5 border border-line bg-white rounded-2xl overflow-hidden shrink-0 lg:mb-10">
        <div className="absolute inset-0 bg-blue-50"></div>
        <div className="relative z-10 px-5 flex items-center justify-between gap-4 lg:px-6">
          <div>
            <p className="text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Target company</p>
            <h2 className="text-lg font-bold text-ink lg:text-2xl">
              {selectedCompany ? selectedCompany.name : 'Pick a company to unlock prep kits'}
            </h2>
            <p className="text-xs text-muted font-mono">
              {selectedCompany ? 'Resume, interview, and success stories are personalized.' : 'Choose any company and we will tailor guidance for you.'}
            </p>
          </div>
          <button
            onClick={() => onSelectModule(AppView.COMPANY_DISCOVERY)}
            className="shrink-0 px-4 py-2 rounded-full border border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan text-[10px] font-mono uppercase tracking-widest hover:bg-neon-cyan/20 transition-colors"
          >
            {selectedCompany ? 'Change' : 'Select'}
          </button>
        </div>
      </section>

      <section className="mb-10 shrink-0">
        <h2 className="text-sm font-mono text-ink tracking-widest border-l-2 border-neon-cyan pl-3 mb-5 uppercase">Quick Actions</h2>
        <button
          onClick={() => onSelectModule(AppView.LIVE_COACHING)}
          className="mb-4 w-full overflow-hidden rounded-2xl border border-neon-green/30 bg-blue-50 p-4 text-left transition-all hover:-translate-y-1 active:scale-[0.98] lg:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neon-green/30 bg-white">
                <span className="material-symbols-outlined text-3xl text-neon-green">videocam</span>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-green "></span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neon-green">New Main</span>
                </div>
                <h3 className="mb-1 text-lg font-bold text-ink lg:text-2xl">Live Coaching</h3>
                <p className="max-w-[220px] text-xs font-mono leading-relaxed text-muted lg:max-w-xl">
                  Job search guidance, outreach help, and 1:1 planning
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined shrink-0 text-neon-green">arrow_forward</span>
          </div>
        </button>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { view: AppView.ROLE_HUB, label: 'Job Guides', desc: 'Browse roles & paths', icon: 'explore', color: 'text-neon-cyan' },
            { view: AppView.COMPANY_DISCOVERY, label: 'Companies', desc: 'Find hiring teams', icon: 'corporate_fare', color: 'text-neon-violet' },
            { view: AppView.JOB_LIST, label: 'Job List', desc: 'Open positions', icon: 'search', color: 'text-neon-amber' },
            { view: AppView.AI_CHAT, label: 'AI Assistant', desc: 'Ask anything', icon: 'forum', color: 'text-primary' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onSelectModule(item.view)}
              className="glass-panel p-4 rounded-2xl text-left hover:-translate-y-1 transition-all border border-line lg:min-h-36 lg:p-5"
            >
              <div className={`material-symbols-outlined ${item.color} text-2xl mb-3`}>{item.icon}</div>
              <h3 className="text-sm font-bold text-ink mb-1">{item.label}</h3>
              <p className="text-[10px] text-muted font-mono">{item.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4 shrink-0">
        <h2 className="text-sm font-mono text-ink tracking-widest border-l-2 border-neon-cyan pl-3 mb-2 uppercase">Career Toolkit</h2>
        <p className="text-[10px] text-muted font-mono mb-4">Personalized when you pick a target company.</p>
        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          <button
            onClick={() => handleProtectedNav(AppView.GUIDE)}
            className="w-full iso-card border-neon-cyan/30 p-5 rounded-2xl group cursor-pointer hover:-translate-y-1 text-left transition-all active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-neon-cyan text-2xl">description</span>
              <div>
                <h3 className="text-lg font-bold text-ink mb-1">Job Guide</h3>
                <p className="text-xs text-muted font-mono leading-relaxed">Application steps, referrals, and do-not-miss tips</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => handleProtectedNav(AppView.RESUME_TEMPLATES)}
            className="w-full iso-card border-cyan-300/30 p-5 rounded-2xl group cursor-pointer hover:-translate-y-1 text-left transition-all active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">badge</span>
              <div>
                <h3 className="text-lg font-bold text-ink mb-1">ATS Resume Templates</h3>
                <p className="text-xs text-muted font-mono leading-relaxed">Copy-ready formats optimized for shortlisting</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => handleProtectedNav(AppView.INTERVIEW_PREP)}
            className="w-full iso-card border-neon-violet/30 p-5 rounded-2xl group cursor-pointer hover:-translate-y-1 text-left transition-all active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-neon-violet text-2xl">terminal</span>
              <div>
                <h3 className="text-lg font-bold text-ink mb-1">Interview Prep</h3>
                <p className="text-xs text-muted font-mono leading-relaxed">Question banks, practice, and resources</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => handleProtectedNav(AppView.SUCCESS_STORIES)}
            className="w-full iso-card border-neon-amber/30 p-5 rounded-2xl group cursor-pointer hover:-translate-y-1 text-left transition-all active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-neon-amber text-2xl">auto_awesome</span>
              <div>
                <h3 className="text-lg font-bold text-ink mb-1">Success Stories</h3>
                <p className="text-xs text-muted font-mono leading-relaxed">See how others got hired and learn their playbook</p>
              </div>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProfileHubView;
