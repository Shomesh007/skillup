
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import CareerHomeView from './components/CareerHomeView';
import JourneyContext from './components/JourneyContext';
import UnsavedWorkNotice from './components/UnsavedWorkNotice';
import {resolveJourney,saveJourney} from './src/domain/journey';
import { AppView, UserLevel, Company, JobOpportunity } from './types';
import LandingView from './components/LandingView';
import LevelSelectView from './components/LevelSelectView';
const RoleHubView = lazy(() => import('./components/RoleHubView'));
const CompanyDiscoveryView = lazy(() => import('./components/CompanyDiscoveryView'));
const CompanyProfileView = lazy(() => import('./components/CompanyProfileView'));
const GuideView = lazy(() => import('./components/GuideView'));
const ResumeTemplatesView = lazy(() => import('./components/ResumeTemplatesView'));
const InterviewPrepView = lazy(() => import('./components/InterviewPrepView'));
const SuccessStoriesView = lazy(() => import('./components/SuccessStoriesView'));
const ChatView = lazy(() => import('./components/ChatView'));
const JobListView = lazy(() => import('./components/JobListView'));
const LiveCoachingView = lazy(() => import('./components/LiveCoachingView'));
const AuthView = lazy(() => import('./components/AuthView'));
import type { StudentSetupProfile } from './components/StudentSetupView';
const StudentSetupView = lazy(() => import('./components/StudentSetupView'));
const StudentRoleExplorerView = lazy(() => import('./components/StudentRoleExplorerView'));
const StudentTrackBuilderView = lazy(() => import('./components/StudentTrackBuilderView'));
import type { GraduateSetupProfile } from './components/GraduateSetupView';
const GraduateSetupView = lazy(() => import('./components/GraduateSetupView'));
const GraduateRoleTargeterView = lazy(() => import('./components/GraduateRoleTargeterView'));
const GraduateShortlistFixerView = lazy(() => import('./components/GraduateShortlistFixerView'));
import type { SwitcherSetupProfile } from './components/SwitcherSetupView';
const SwitcherSetupView = lazy(() => import('./components/SwitcherSetupView'));
const SwitcherTargeterView = lazy(() => import('./components/SwitcherTargeterView'));
const SwitcherTranslatorView = lazy(() => import('./components/SwitcherTranslatorView'));
import BottomNav from './components/BottomNav';
import NavHeader from './components/NavHeader';
import DesktopSidebar from './components/DesktopSidebar';
import { useAppContext } from './context/AppContext';
import { classifyJobGuide } from './src/utils/jobGuideClassifier';
import { COMPANIES } from './constants';

function readWorkspace() {
  try { const saved = JSON.parse(localStorage.getItem('skillup_workspace_v2') || '{}'); return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {}; } catch { return {}; }
}
const savedWorkspace = readWorkspace();
const initialView = Object.values(AppView).includes(location.hash.slice(1) as AppView) ? location.hash.slice(1) as AppView : AppView.HOME;
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(() => initialView);
  const [viewHistory, setViewHistory] = useState<AppView[]>([]);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(() => Object.values(UserLevel).includes(savedWorkspace.level) ? savedWorkspace.level : null);
  const [selectedRole, setSelectedRole] = useState<string | null>(savedWorkspace.role || null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(savedWorkspace.company || null);
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(savedWorkspace.job || null);
  const [jobListCompanyFilter, setJobListCompanyFilter] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentSetupProfile | null>(savedWorkspace.student || null);
  const [graduateProfile, setGraduateProfile] = useState<GraduateSetupProfile | null>(savedWorkspace.graduate || null);
  const [switcherProfile, setSwitcherProfile] = useState<SwitcherSetupProfile | null>(savedWorkspace.switcher || null);
  const { logout, setUserLevel: setContextUserLevel } = useAppContext();
  const browserNavigation = useRef(false);
  useEffect(() => {
    const handlePop = () => {
      browserNavigation.current = true;
      const next = location.hash.slice(1) as AppView;
      setCurrentView(Object.values(AppView).includes(next) ? next : AppView.HOME);
    };
    window.addEventListener('popstate', handlePop);
    window.addEventListener('hashchange', handlePop);
    return () => {window.removeEventListener('popstate', handlePop);window.removeEventListener('hashchange', handlePop);};
  }, []);
  useEffect(() => {
    const hash = currentView === AppView.HOME ? '' : '#' + currentView;
    if (browserNavigation.current) browserNavigation.current = false;
    else if (location.hash !== hash) history.pushState(null, '', location.pathname + location.search + hash);
  }, [currentView]);
  useEffect(() => {
    try { localStorage.setItem('skillup_workspace_v2', JSON.stringify({level:userLevel,role:selectedRole,company:selectedCompany,job:selectedJob,student:studentProfile,graduate:graduateProfile,switcher:switcherProfile})); } catch {}
  }, [userLevel, selectedRole, selectedCompany, selectedJob, studentProfile, graduateProfile, switcherProfile]);
  const fallbackCompany: Company = {
    id: '',
    name: 'your target company',
    tagline: '',
    logo: '🏢',
    rating: 4.6,
    location: 'Multiple Locations',
    salary: 'Competitive',
    experience: '0-5 Years',
    category: 'PRODUCT',
    isHiring: true,
    stack: { frontend: [], backend: [], database: [], cloud: [] },
    about: 'Pick a company to personalize these insights.',
    timeline: [],
  };

  const navigateTo = (view: AppView, companyFilter?: string) => {
    if (view === AppView.JOB_LIST) setJobListCompanyFilter(companyFilter || null);
    if (view === currentView) return;
    if (view === AppView.PROFILE_HUB || view === AppView.STUDENT_HOME || view === AppView.GRADUATE_HOME || view === AppView.SWITCHER_HOME) {
      setViewHistory([]);
      setCurrentView(view);
      return;
    }
    setViewHistory((prev) => [...prev, currentView]);
    setCurrentView(view);
  };

  const goToLevelSelect = () => navigateTo(AppView.LEVEL_SELECT);

  const selectPath = (level: UserLevel) => {
    setUserLevel(level);
    setContextUserLevel(level);
    navigateTo(level === UserLevel.STUDENT ? AppView.STUDENT_SETUP : level === UserLevel.GRADUATE ? AppView.GRADUATE_SETUP : AppView.SWITCHER_SETUP);
  };
  const handleLogout = () => {
    logout();
    setUserLevel(null);
    setSelectedRole(null);
    setSelectedCompany(null);
    setSelectedJob(null);
    setStudentProfile(null);
    setGraduateProfile(null);
    setSwitcherProfile(null);
    setViewHistory([]);
    setCurrentView(AppView.HOME);
  };

  const buildJobCompany = (job: JobOpportunity): Company => {
    const jobGuide = classifyJobGuide(job);
    const knownCompany = COMPANIES.find((company) => company.name === job.company);
    return knownCompany || {
      ...fallbackCompany,
      id: job.company.toLowerCase().replace(/\s+/g, '-'),
      name: job.company,
      tagline: `${jobGuide.normalizedTitle} hiring guide`,
      location: job.location,
      salary: job.salary,
      experience: job.experience,
      about: job.description || `${job.company} is hiring for ${jobGuide.normalizedTitle} in ${job.location}.`,
      linkedInUrl: job.linkedinUrl,
      stack: {
        frontend: job.skills || [],
        backend: [],
        database: [],
        cloud: [],
      },
      timeline: [
        { step: 'Apply on LinkedIn', duration: job.postedAt || 'Recent' },
        { step: 'Resume screening', duration: job.employmentType || 'Role dependent' },
      ],
    };
  };

  const handleSelectJob = (job: JobOpportunity) => {
    setSelectedJob(job);
    setSelectedCompany(buildJobCompany(job));
    navigateTo(AppView.GUIDE);
  };

  const handleShowJobsByCompany = (companyName: string) => {
    navigateTo(AppView.JOB_LIST, companyName);
  };

  const handleBack = () => {
    // Clear company filter when leaving job list
    if (currentView === AppView.JOB_LIST) {
      setJobListCompanyFilter(null);
    }
    
    if (viewHistory.length > 0) {
      const next = viewHistory[viewHistory.length - 1];
      setViewHistory((prev) => prev.slice(0, -1));
      setCurrentView(next);
      return;
    }

    switch (currentView) {
      case AppView.AUTH:
      case AppView.LEVEL_SELECT:
        setCurrentView(AppView.HOME);
        break;
      default:
        setCurrentView(userLevel === UserLevel.STUDENT ? AppView.STUDENT_HOME : userLevel === UserLevel.GRADUATE ? AppView.GRADUATE_HOME : userLevel === UserLevel.PRO ? AppView.SWITCHER_HOME : AppView.PROFILE_HUB);
        break;
    }
  };

  const nextStep = (() => {
    const profile=userLevel===UserLevel.STUDENT?studentProfile:userLevel===UserLevel.GRADUATE?graduateProfile:switcherProfile;
    if(!profile||!userLevel)return undefined;
    const journey=resolveJourney(userLevel,profile as unknown as Record<string,string>);
    return {label:journey.label,description:journey.reason,view:journey.destination};
  })();
  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return (
          <LandingView
            onStart={goToLevelSelect}
            onLogin={() => navigateTo(AppView.AUTH)}
            onSelectPath={selectPath}
            onExplore={navigateTo}
          />
        );
      case AppView.AUTH:
        return <AuthView onSuccess={() => navigateTo(AppView.LEVEL_SELECT)} onBack={handleBack} />;
      case AppView.LEVEL_SELECT:
        return (
          <LevelSelectView
            onSelect={(l) => {
              setUserLevel(l);
              setContextUserLevel(l);
              if (l === UserLevel.STUDENT) {
                navigateTo(AppView.STUDENT_SETUP);
                return;
              }
              if (l === UserLevel.GRADUATE) {
                navigateTo(AppView.GRADUATE_SETUP);
                return;
              }
              if (l === UserLevel.PRO) {
                navigateTo(AppView.SWITCHER_SETUP);
                return;
              }
              navigateTo(AppView.PROFILE_HUB);
            }}
            onBack={handleBack}
          />
        );
      case AppView.STUDENT_SETUP:
        return (
          <StudentSetupView
            onBack={handleBack}
            onOpenCoaching={() => navigateTo(AppView.LIVE_COACHING)}
            onComplete={(profile) => {
              setStudentProfile(profile);
              const journey=resolveJourney(UserLevel.STUDENT,profile as unknown as Record<string,string>);
              saveJourney(journey);
              navigateTo(journey.destination);
            }}
          />
        );
      case AppView.STUDENT_HOME:
        return <CareerHomeView nextStep={nextStep} level={userLevel} onNavigate={navigateTo} onEdit={goToLevelSelect} />;
      case AppView.STUDENT_ROLE_EXPLORER:
        return <StudentRoleExplorerView onNavigate={navigateTo} onSelectRole={(role) => { setSelectedRole(role); navigateTo(AppView.COMPANY_DISCOVERY); }} onOpenCoaching={() => navigateTo(AppView.LIVE_COACHING)} />;
      case AppView.STUDENT_TRACK_BUILDER:
        return <StudentTrackBuilderView onOpenCoaching={() => navigateTo(AppView.LIVE_COACHING)} />;
      case AppView.GRADUATE_SETUP:
        return (
          <GraduateSetupView
            onBack={handleBack}
            onOpenCoaching={() => navigateTo(AppView.LIVE_COACHING)}
            onComplete={(profile) => {
              setGraduateProfile(profile);
              const journey=resolveJourney(UserLevel.GRADUATE,profile as unknown as Record<string,string>);
              saveJourney(journey);
              navigateTo(journey.destination);
            }}
          />
        );
      case AppView.GRADUATE_HOME:
        return <CareerHomeView nextStep={nextStep} level={userLevel} onNavigate={navigateTo} onEdit={goToLevelSelect} />;
      case AppView.GRADUATE_ROLE_TARGETER:
        return <GraduateRoleTargeterView onNavigate={navigateTo} onSelectRole={(role) => { setSelectedRole(role); navigateTo(AppView.COMPANY_DISCOVERY); }} onOpenCoaching={() => navigateTo(AppView.LIVE_COACHING)} />;
      case AppView.GRADUATE_SHORTLIST_FIXER:
        return <GraduateShortlistFixerView onNavigate={navigateTo} onOpenCoaching={() => navigateTo(AppView.LIVE_COACHING)} />;
      case AppView.SWITCHER_SETUP:
        return (
          <SwitcherSetupView
            onBack={handleBack}
            onOpenCoaching={() => navigateTo(AppView.LIVE_COACHING)}
            onComplete={(profile) => {
              setSwitcherProfile(profile);
              const journey=resolveJourney(UserLevel.PRO,profile as unknown as Record<string,string>);
              saveJourney(journey);
              navigateTo(journey.destination);
            }}
          />
        );
      case AppView.SWITCHER_HOME:
        return <CareerHomeView nextStep={nextStep} level={userLevel} onNavigate={navigateTo} onEdit={goToLevelSelect} />;
      case AppView.SWITCHER_TARGETER:
        return <SwitcherTargeterView onNavigate={navigateTo} onSelectRole={(role) => { setSelectedRole(role); navigateTo(AppView.COMPANY_DISCOVERY); }} onOpenCoaching={() => navigateTo(AppView.LIVE_COACHING)} />;
      case AppView.SWITCHER_TRANSLATOR:
        return <SwitcherTranslatorView onNavigate={navigateTo} onOpenCoaching={() => navigateTo(AppView.LIVE_COACHING)} />;
      case AppView.ROLE_HUB:
        return <RoleHubView onSelectRole={(r) => { setSelectedRole(r); navigateTo(AppView.COMPANY_DISCOVERY); }} />;
      case AppView.COMPANY_DISCOVERY:
        return <CompanyDiscoveryView role={selectedRole || ''} onSelectCompany={(c) => { setSelectedJob(null); setSelectedCompany(c); navigateTo(AppView.COMPANY_PROFILE); }} onBack={handleBack} onShowJobs={handleShowJobsByCompany} />;
      case AppView.COMPANY_PROFILE:
        if (!selectedCompany) {
          return <CompanyDiscoveryView role={selectedRole || ''} onSelectCompany={(c) => { setSelectedJob(null); setSelectedCompany(c); navigateTo(AppView.COMPANY_PROFILE); }} onBack={handleBack} onShowJobs={handleShowJobsByCompany} />;
        }
        return <CompanyProfileView company={selectedCompany} onAction={(view) => navigateTo(view)} onBack={handleBack} onShowJobs={handleShowJobsByCompany} />;
      case AppView.GUIDE:
        return <GuideView onNavigate={navigateTo} company={selectedCompany || fallbackCompany} job={selectedJob} onBack={handleBack} onOpenTemplates={() => navigateTo(AppView.RESUME_TEMPLATES)} />;
      case AppView.RESUME_TEMPLATES:
        return <ResumeTemplatesView company={selectedCompany || fallbackCompany} />;
      case AppView.INTERVIEW_PREP:
        return <InterviewPrepView company={selectedCompany || fallbackCompany} onBack={handleBack} />;
      case AppView.SUCCESS_STORIES:
        return <SuccessStoriesView company={selectedCompany || fallbackCompany} onBack={handleBack} />;
      case AppView.AI_CHAT:
        return <ChatView onBack={handleBack} onNavigate={navigateTo} />;
      case AppView.JOB_LIST:
        return <JobListView role={selectedRole || 'Engineering'} companyName={jobListCompanyFilter || undefined} onSelectJob={handleSelectJob} onBack={handleBack} />;
      case AppView.PROFILE_HUB:
        return <CareerHomeView nextStep={nextStep} level={userLevel} onNavigate={navigateTo} onEdit={goToLevelSelect} />;
      case AppView.LIVE_COACHING:
        return <LiveCoachingView />;
      default:
        return (
          <LandingView
            onStart={goToLevelSelect}
            onLogin={() => navigateTo(AppView.AUTH)}
            onSelectPath={selectPath}
            onExplore={navigateTo}
          />
        );
    }
  };

  const setupViews = [AppView.STUDENT_SETUP, AppView.GRADUATE_SETUP, AppView.SWITCHER_SETUP];
  const showNav = ![AppView.HOME, AppView.LEVEL_SELECT, AppView.AUTH, ...setupViews].includes(currentView);
  const showTopHeader = ![AppView.HOME, AppView.LEVEL_SELECT, AppView.AUTH, ...setupViews].includes(currentView);
  const dashboardView = userLevel === UserLevel.STUDENT ? AppView.STUDENT_HOME : userLevel === UserLevel.GRADUATE ? AppView.GRADUATE_HOME : userLevel === UserLevel.PRO ? AppView.SWITCHER_HOME : AppView.PROFILE_HUB;

  return (
    <div className={showNav ? 'workspace-shell' : 'public-shell'}>
      {showNav && <DesktopSidebar currentView={currentView} level={userLevel} role={selectedRole} company={selectedCompany?.name} dashboardView={dashboardView} onViewChange={navigateTo} onLogout={() => navigateTo(AppView.HOME)} />}
      <div className={showNav ? 'workspace-main' : 'public-main'}>
        {showTopHeader && <NavHeader level={userLevel} role={selectedRole} company={selectedCompany?.name} view={currentView} onBack={[AppView.PROFILE_HUB,AppView.STUDENT_HOME,AppView.GRADUATE_HOME,AppView.SWITCHER_HOME].includes(currentView) ? undefined : handleBack} onLogout={() => navigateTo(AppView.HOME)} onNavigate={navigateTo} />}
        <UnsavedWorkNotice onResume={()=>navigateTo(AppView.RESUME_TEMPLATES)}/>
        {showNav&&<JourneyContext view={currentView} onEdit={goToLevelSelect}/>}
        <main id="main-content" className={showNav ? 'workspace-body' : 'public-body'} key={currentView}>
          <div className={currentView === AppView.HOME || currentView === AppView.LEVEL_SELECT || [AppView.STUDENT_HOME,AppView.GRADUATE_HOME,AppView.SWITCHER_HOME,AppView.PROFILE_HUB].includes(currentView) ? 'fresh-view' : 'tool-view'}><Suspense fallback={<div className="p-10 text-sm text-muted" role="status">Opening your next step…</div>}>{renderView()}</Suspense></div>
        </main>
        {showNav && <BottomNav currentView={currentView} dashboardView={dashboardView} onViewChange={navigateTo} />}
      </div>
    </div>
  );
};
export default App;
