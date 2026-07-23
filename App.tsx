
import React, { useState } from 'react';
import { AppView, UserLevel, Company, JobOpportunity } from './types';
import LandingView from './components/LandingView';
import LevelSelectView from './components/LevelSelectView';
import RoleHubView from './components/RoleHubView';
import CompanyDiscoveryView from './components/CompanyDiscoveryView';
import CompanyProfileView from './components/CompanyProfileView';
import GuideView from './components/GuideView';
import ResumeTemplatesView from './components/ResumeTemplatesView';
import InterviewPrepView from './components/InterviewPrepView';
import SuccessStoriesView from './components/SuccessStoriesView';
import ChatView from './components/ChatView';
import JobListView from './components/JobListView';
import ProfileHubView from './components/ProfileHubView';
import LiveCoachingView from './components/LiveCoachingView';
import AuthView from './components/AuthView';
import BottomNav from './components/BottomNav';
import NavHeader from './components/NavHeader';
import DesktopSidebar from './components/DesktopSidebar';
import { useAppContext } from './context/AppContext';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(() => AppView.HOME);
  const [viewHistory, setViewHistory] = useState<AppView[]>([]);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [jobListCompanyFilter, setJobListCompanyFilter] = useState<string | null>(null);
  const { logout, setUserLevel: setContextUserLevel } = useAppContext();
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

  const navigateTo = (view: AppView) => {
    if (view === currentView) return;
    if (view === AppView.PROFILE_HUB) {
      setViewHistory([]);
      setCurrentView(view);
      return;
    }
    setViewHistory((prev) => [...prev, currentView]);
    setCurrentView(view);
  };

  const goToLevelSelect = () => {
    setSelectedRole(null);
    setSelectedCompany(null);
    setSelectedJob(null);
    navigateTo(AppView.LEVEL_SELECT);
  };

  const handleLogout = () => {
    logout();
    setUserLevel(null);
    setSelectedRole(null);
    setSelectedCompany(null);
    setSelectedJob(null);
    setViewHistory([]);
    setCurrentView(AppView.LEVEL_SELECT);
  };

  const buildJobCompany = (job: JobOpportunity): Company => {
    const knownCompany = [fallbackCompany].find((company) => company.name === job.company);
    return knownCompany || {
      ...fallbackCompany,
      id: job.company.toLowerCase().replace(/\s+/g, '-'),
      name: job.company,
      tagline: `${job.title} hiring guide`,
      location: job.location,
      salary: job.salary,
      experience: job.experience,
      about: job.description || `${job.company} is hiring for ${job.title} in ${job.location}.`,
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
    setJobListCompanyFilter(companyName);
    navigateTo(AppView.JOB_LIST);
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
        setCurrentView(AppView.PROFILE_HUB);
        break;
    }
  };

  const Background = () => (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgNDBoNDBNNDAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDAsMjQwLDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] bg-repeat animate-circuit-move opacity-20"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return (
          <LandingView
            onStart={goToLevelSelect}
            onLogin={() => navigateTo(AppView.AUTH)}
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
              navigateTo(AppView.PROFILE_HUB);
            }}
            onBack={handleBack}
          />
        );
      case AppView.ROLE_HUB:
        return <RoleHubView onSelectRole={(r) => { setSelectedRole(r); navigateTo(AppView.COMPANY_DISCOVERY); }} />;
      case AppView.COMPANY_DISCOVERY:
        return <CompanyDiscoveryView role={selectedRole || ''} onSelectCompany={(c) => { setSelectedCompany(c); navigateTo(AppView.COMPANY_PROFILE); }} onBack={handleBack} onShowJobs={handleShowJobsByCompany} />;
      case AppView.COMPANY_PROFILE:
        if (!selectedCompany) {
          return <CompanyDiscoveryView role={selectedRole || ''} onSelectCompany={(c) => { setSelectedCompany(c); navigateTo(AppView.COMPANY_PROFILE); }} onBack={handleBack} onShowJobs={handleShowJobsByCompany} />;
        }
        return <CompanyProfileView company={selectedCompany} onAction={(view) => navigateTo(view)} onBack={handleBack} onShowJobs={handleShowJobsByCompany} />;
      case AppView.GUIDE:
        return <GuideView company={selectedCompany || fallbackCompany} job={selectedJob} onBack={handleBack} onOpenTemplates={() => navigateTo(AppView.RESUME_TEMPLATES)} />;
      case AppView.RESUME_TEMPLATES:
        return <ResumeTemplatesView company={selectedCompany || fallbackCompany} />;
      case AppView.INTERVIEW_PREP:
        return <InterviewPrepView company={selectedCompany || fallbackCompany} onBack={handleBack} />;
      case AppView.SUCCESS_STORIES:
        return <SuccessStoriesView company={selectedCompany || fallbackCompany} onBack={handleBack} />;
      case AppView.AI_CHAT:
        return <ChatView onBack={handleBack} />;
      case AppView.JOB_LIST:
        return <JobListView role={selectedRole || 'Engineering'} companyName={jobListCompanyFilter || undefined} onSelectJob={handleSelectJob} onBack={handleBack} />;
      case AppView.PROFILE_HUB:
        return <ProfileHubView onSelectModule={(m) => navigateTo(m)} onBack={handleBack} />;
      case AppView.LIVE_COACHING:
        return <LiveCoachingView />;
      default:
        return (
          <LandingView
            onStart={goToLevelSelect}
            onLogin={() => navigateTo(AppView.AUTH)}
          />
        );
    }
  };

  const showNav = ![AppView.HOME, AppView.LEVEL_SELECT, AppView.AUTH].includes(currentView);
  const showTopHeader = ![AppView.HOME, AppView.LEVEL_SELECT, AppView.AUTH].includes(currentView);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center font-display lg:h-auto lg:min-h-screen lg:overflow-visible">
      <Background />
      <div className={`relative z-10 w-full h-full overflow-hidden bg-background-dark/90 backdrop-blur-md border-x border-white/5 lg:h-auto lg:min-h-screen lg:overflow-visible ${
        showNav
          ? 'max-w-md flex flex-col lg:max-w-none lg:bg-transparent lg:backdrop-blur-0 lg:border-0 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6 lg:p-6'
          : 'max-w-md flex flex-col lg:max-w-7xl lg:bg-transparent lg:backdrop-blur-0 lg:border-0'
      }`}>
        {showNav && (
          <DesktopSidebar
            currentView={currentView}
            level={userLevel}
            role={selectedRole}
            company={selectedCompany?.name}
            onViewChange={navigateTo}
            onLogout={handleLogout}
          />
        )}
        <div className={`min-h-0 overflow-hidden flex flex-col lg:h-auto lg:overflow-visible ${
          showNav ? 'h-full lg:min-h-[calc(100vh-3rem)] lg:rounded-[28px] lg:border lg:border-white/10 lg:bg-background-dark/75 lg:shadow-2xl lg:shadow-black/30' : 'h-full'
        }`}>
          {showTopHeader && (
            <NavHeader
              level={userLevel}
              role={selectedRole}
              company={selectedCompany?.name}
              view={currentView}
              onBack={currentView === AppView.PROFILE_HUB ? undefined : handleBack}
              onLogout={handleLogout}
            />
          )}
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative lg:overflow-visible">
            {renderView()}
          </main>
          {showNav && <BottomNav currentView={currentView} onViewChange={navigateTo} />}
        </div>
      </div>
    </div>
  );
};

export default App;
