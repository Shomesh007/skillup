import React from 'react';
import { AppView, UserLevel } from '../types';

interface Props {
  currentView: AppView;
  level: UserLevel | null;
  role: string | null;
  company?: string;
  dashboardView?: AppView;
  onViewChange: (view: AppView) => void;
  onLogout: () => void;
}

const DesktopSidebar: React.FC<Props> = ({ currentView, level, role, company, dashboardView = AppView.PROFILE_HUB, onViewChange, onLogout }) => {
  const studentItems = level === UserLevel.STUDENT
    ? [
        { view: AppView.STUDENT_ROLE_EXPLORER, icon: 'travel_explore', label: 'Career Explorer', hint: 'Exact IT titles' },
        { view: AppView.STUDENT_TRACK_BUILDER, icon: 'route', label: 'Track Builder', hint: 'Projects and proof' },
      ]
    : [];
  const graduateItems = level === UserLevel.GRADUATE
    ? [
        { view: AppView.GRADUATE_ROLE_TARGETER, icon: 'adjust', label: 'Role Targeter', hint: 'Fresher role focus' },
        { view: AppView.GRADUATE_SHORTLIST_FIXER, icon: 'fact_check', label: 'Shortlist Fixer', hint: 'Get more calls' },
      ]
    : [];
  const switcherItems = level === UserLevel.PRO
    ? [
        { view: AppView.SWITCHER_TARGETER, icon: 'conversion_path', label: 'Switch Targeter', hint: 'Pivot path' },
        { view: AppView.SWITCHER_TRANSLATOR, icon: 'translate', label: 'Experience Translator', hint: 'Resume bridge' },
      ]
    : [];

  const navGroups = [
    {
      label: 'Workspace',
      items: [
        {
          view: dashboardView,
          icon: dashboardView === AppView.STUDENT_HOME ? 'school' : dashboardView === AppView.GRADUATE_HOME ? 'workspace_premium' : dashboardView === AppView.SWITCHER_HOME ? 'move_up' : 'space_dashboard',
          label: dashboardView === AppView.STUDENT_HOME ? 'Student Home' : dashboardView === AppView.GRADUATE_HOME ? 'Graduate Home' : dashboardView === AppView.SWITCHER_HOME ? 'Switcher Home' : 'Dashboard',
          hint: dashboardView === AppView.STUDENT_HOME ? 'Your student path' : dashboardView === AppView.GRADUATE_HOME ? 'Your job cockpit' : dashboardView === AppView.SWITCHER_HOME ? 'Your migration console' : 'Your command center',
        },
        { view: AppView.LIVE_COACHING, icon: 'videocam', label: 'Live Coaching', hint: 'Job-search guidance' },
        { view: AppView.AI_CHAT, icon: 'forum', label: 'AI Assistant', hint: 'Ask career questions' },
      ],
    },
    {
      label: 'Explore',
      items: [
        ...studentItems,
        ...graduateItems,
        ...switcherItems,
        { view: AppView.ROLE_HUB, icon: 'explore', label: 'Job Guides', hint: 'Roles and paths' },
        { view: AppView.COMPANY_DISCOVERY, icon: 'corporate_fare', label: 'Companies', hint: 'Hiring teams' },
        { view: AppView.JOB_LIST, icon: 'search', label: 'Job List', hint: 'Open positions' },
        { view: AppView.RESUME_TEMPLATES, icon: 'badge', label: 'Resume', hint: 'ATS templates' },
      ],
    },
    {
      label: 'Prepare',
      items: [
        { view: AppView.GUIDE, icon: 'description', label: 'Apply Guide', hint: 'Steps and referrals' },
        { view: AppView.INTERVIEW_PREP, icon: 'terminal', label: 'Interview Prep', hint: 'Questions and tips' },
        { view: AppView.SUCCESS_STORIES, icon: 'auto_awesome', label: 'Success Stories', hint: 'Hiring playbooks' },
      ],
    },
  ];

  const isActive = (view: AppView) => {
    if (view === currentView) return true;
    if (view === AppView.COMPANY_DISCOVERY && currentView === AppView.COMPANY_PROFILE) return true;
    return false;
  };

  return (
    <aside className="hidden lg:flex h-full w-[280px] shrink-0 flex-col rounded-[28px] border border-white/10 bg-black/30 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">
      <div className="mb-8 flex items-center gap-3 px-2 pt-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neon-cyan/30 bg-neon-cyan/10 shadow-[0_0_24px_rgba(0,240,255,0.16)]">
          <span className="text-sm font-bold text-white">S4</span>
        </div>
        <div>
          <div className="text-sm font-bold tracking-wide text-white">s4skillup</div>
          <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-neon-cyan/70">Career OS</div>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-neon-green shadow-[0_0_8px_rgba(10,255,0,0.8)]"></span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neon-green">Plan Active</span>
        </div>
        <div className="text-sm font-semibold leading-tight text-white">{company || role || 'Build your target list'}</div>
        <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-gray-500">{level || 'Onboarding complete'}</div>
      </div>

      <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto no-scrollbar pr-1">
        {navGroups.map((group) => (
          <section key={group.label}>
            <div className="mb-2 px-2 text-[10px] font-mono uppercase tracking-[0.28em] text-gray-600">{group.label}</div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.view);

                return (
                  <button
                    key={item.view}
                    onClick={() => onViewChange(item.view)}
                    className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all ${
                      active
                        ? 'border-neon-cyan/40 bg-neon-cyan/10 text-white shadow-[inset_0_0_18px_rgba(0,240,255,0.08)]'
                        : 'border-transparent text-gray-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-2xl ${active ? 'text-neon-cyan text-neon' : 'text-gray-500 group-hover:text-neon-cyan'}`}>
                      {item.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold leading-tight">{item.label}</span>
                      <span className="block truncate text-[10px] font-mono text-gray-600">{item.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-gray-400 transition-colors hover:border-neon-cyan/40 hover:bg-neon-cyan/10 hover:text-neon-cyan"
      >
        <span className="material-symbols-outlined text-base">logout</span>
        Log Out
      </button>
    </aside>
  );
};

export default DesktopSidebar;
