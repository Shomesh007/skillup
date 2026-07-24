
import React from 'react';
import { AppView, UserLevel } from '../types';

interface Props {
  level: UserLevel | null;
  role: string | null;
  company?: string;
  view: AppView;
}

const Breadcrumbs: React.FC<Props> = ({ level, role, company, view }) => {
  const getLabel = (v: AppView) => {
    if (v === AppView.COMPANY_DISCOVERY) return 'Companies';
    if (v === AppView.COMPANY_PROFILE) return 'Hub';
    if (v === AppView.GUIDE) return 'Guide';
    if (v === AppView.RESUME_TEMPLATES) return 'Templates';
    if (v === AppView.INTERVIEW_PREP) return 'Prep';
    if (v === AppView.SUCCESS_STORIES) return 'Stories';
    if (v === AppView.JOB_LIST) return 'Jobs';
    if (v === AppView.PROFILE_HUB) return 'Profile';
    if (v === AppView.STUDENT_HOME) return 'Student Home';
    if (v === AppView.STUDENT_SETUP) return 'Student Setup';
    if (v === AppView.STUDENT_ROLE_EXPLORER) return 'Career Explorer';
    if (v === AppView.STUDENT_TRACK_BUILDER) return 'Track Builder';
    if (v === AppView.GRADUATE_HOME) return 'Graduate Home';
    if (v === AppView.GRADUATE_SETUP) return 'Graduate Setup';
    if (v === AppView.GRADUATE_ROLE_TARGETER) return 'Role Targeter';
    if (v === AppView.GRADUATE_SHORTLIST_FIXER) return 'Shortlist Fixer';
    if (v === AppView.SWITCHER_HOME) return 'Switcher Home';
    if (v === AppView.SWITCHER_SETUP) return 'Switcher Setup';
    if (v === AppView.SWITCHER_TARGETER) return 'Switch Targeter';
    if (v === AppView.SWITCHER_TRANSLATOR) return 'Experience Translator';
    if (v === AppView.AI_CHAT) return 'AI Consultant';
    return '';
  };

  return (
    <nav className="px-6 pt-12 pb-2 shrink-0 flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-gray-500 uppercase overflow-x-auto no-scrollbar whitespace-nowrap">
      <span>Home</span>
      {level && (
        <>
          <span className="text-gray-700">/</span>
          <span className="text-neon-cyan/70">{level}</span>
        </>
      )}
      {role && (
        <>
          <span className="text-gray-700">/</span>
          <span className="text-white">{role}</span>
        </>
      )}
      {company && (
        <>
          <span className="text-gray-700">/</span>
          <span className="text-primary">{company}</span>
        </>
      )}
      <span className="text-gray-700">/</span>
      <span className="text-neon-cyan animate-pulse">{getLabel(view)}</span>
    </nav>
  );
};

export default Breadcrumbs;
