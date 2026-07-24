import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserLevel } from '../types';
import localRoles from '../files/roles.json';
import { COMPANIES } from '../constants';

export interface Role {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  timeToMastery: string;
  description: string;
  overview?: string;
  companiesHiring: string[];
  learningPath: {
    beginner: { duration: string; estimatedHours: number; topics: string[]; tools: string[]; projectIdeas: string[] };
    intermediate: { duration: string; estimatedHours: number; topics: string[]; tools: string[]; projectIdeas: string[] };
    advanced: { duration: string; estimatedHours: number; topics: string[]; tools: string[]; projectIdeas: string[] };
  };
  requiredTools?: {
    core: string[];
    nice: string[];
    optional: string[];
  };
}

export interface Company {
  id: string;
  name: string;
  tier: string;
  hiringStatus: string;
  logo: string;
  website: string;
  careersPage: string;
  linkedInUrl: string;
  rolesHiring: string[];
  averageSalary: string;
  hiringProcess: { steps: { step: number; name: string; duration: string; tips: string }[] };
  commonQuestions: string[];
  successStories: { id: string; name: string; role: string; prepTime: string; salary: string; story: string }[];
}

interface User {
  id: string;
  email: string;
  careerLevel: UserLevel | null;
  isLoggedIn: boolean;
}

interface AppContextType {
  user: User;
  roles: Role[];
  companies: Company[];
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUserLevel: (level: UserLevel) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: '',
    email: '',
    careerLevel: null,
    isLoggedIn: false,
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const mapLocalRole = (r: any): Role => ({
    id: r.id,
    name: r.name,
    category: r.category,
    difficulty: r.difficulty || 'Mid',
    timeToMastery: r.timeToMastery || r.time_to_mastery || '12 months',
    description: r.description || '',
    overview: r.overview,
    companiesHiring: r.companiesHiring || r.companies_hiring || [],
    learningPath: r.learningPath || {
      beginner: { duration: '2 months', estimatedHours: 60, topics: [], tools: [], projectIdeas: [] },
      intermediate: { duration: '3 months', estimatedHours: 100, topics: [], tools: [], projectIdeas: [] },
      advanced: { duration: '3 months', estimatedHours: 100, topics: [], tools: [], projectIdeas: [] },
    },
    requiredTools: r.requiredTools || (r.required_skills ? { core: r.required_skills, nice: [], optional: [] } : undefined),
  });

  const cloneRole = (role: Role, name: string, idSuffix: string, category?: string): Role => ({
    ...role,
    id: `${role.id}_${idSuffix}`,
    name,
    category: category || role.category,
  });

  const expandRoles = (baseRoles: Role[]): Role[] => {
    const rolesByName = new Map(baseRoles.map((role) => [role.name, role]));
    const expanded: Role[] = [...baseRoles];

    const addAliases = (sourceName: string, aliases: { name: string; idSuffix: string; category?: string }[]) => {
      const source = rolesByName.get(sourceName);
      if (!source) return;
      aliases.forEach((alias) => expanded.push(cloneRole(source, alias.name, alias.idSuffix, alias.category)));
    };

    addAliases('Frontend Developer', [
      { name: 'Frontend Engineer', idSuffix: 'frontend_engineer' },
      { name: 'UI Developer', idSuffix: 'ui_developer' },
      { name: 'UI Engineer', idSuffix: 'ui_engineer' },
      { name: 'React Developer', idSuffix: 'react_developer' },
      { name: 'Angular Developer', idSuffix: 'angular_developer' },
      { name: 'Vue Developer', idSuffix: 'vue_developer' },
    ]);
    addAliases('Backend Developer', [
      { name: 'Backend Engineer', idSuffix: 'backend_engineer' },
      { name: 'API Developer', idSuffix: 'api_developer' },
      { name: 'Node.js Developer', idSuffix: 'node_developer' },
      { name: 'Python Backend Developer', idSuffix: 'python_backend_developer' },
      { name: 'Java Backend Developer', idSuffix: 'java_backend_developer' },
    ]);
    addAliases('Full Stack Developer', [
      { name: 'Full Stack Engineer', idSuffix: 'fullstack_engineer' },
      { name: 'Application Developer', idSuffix: 'application_developer' },
    ]);
    addAliases('Software Engineer', [
      { name: 'Software Developer', idSuffix: 'software_developer' },
      { name: 'SDE 1', idSuffix: 'sde_1' },
      { name: 'SDE 2', idSuffix: 'sde_2' },
      { name: 'SDE 3', idSuffix: 'sde_3' },
      { name: 'Lead Software Engineer', idSuffix: 'lead_software_engineer' },
      { name: 'Staff Software Engineer', idSuffix: 'staff_software_engineer' },
      { name: 'Principal Software Engineer', idSuffix: 'principal_software_engineer' },
    ]);
    addAliases('QA Engineer', [
      { name: 'Quality Engineer', idSuffix: 'quality_engineer' },
      { name: 'QA Analyst', idSuffix: 'qa_analyst' },
      { name: 'SDET', idSuffix: 'sdet' },
    ]);
    addAliases('Automation Tester', [
      { name: 'QA Automation Engineer', idSuffix: 'qa_automation_engineer' },
      { name: 'Automation Test Engineer', idSuffix: 'automation_test_engineer' },
      { name: 'Test Automation Engineer', idSuffix: 'test_automation_engineer' },
    ]);
    addAliases('Manual Tester', [
      { name: 'Functional Tester', idSuffix: 'functional_tester' },
      { name: 'Manual QA Tester', idSuffix: 'manual_qa_tester' },
    ]);
    addAliases('Performance Test Engineer', [
      { name: 'Load Test Engineer', idSuffix: 'load_test_engineer' },
      { name: 'Performance QA Engineer', idSuffix: 'performance_qa_engineer' },
    ]);
    addAliases('API Test Engineer', [
      { name: 'API QA Engineer', idSuffix: 'api_qa_engineer' },
    ]);
    addAliases('Validation Engineer', [
      { name: 'QA Validation Engineer', idSuffix: 'qa_validation_engineer' },
    ]);
    addAliases('Mobile Test Engineer', [
      { name: 'Mobile QA Engineer', idSuffix: 'mobile_qa_engineer' },
    ]);
    addAliases('Data Test Engineer', [
      { name: 'Data Quality Engineer', idSuffix: 'data_quality_engineer' },
    ]);
    addAliases('Data Engineer', [
      { name: 'Data Platform Engineer', idSuffix: 'data_platform_engineer' },
    ]);
    addAliases('Data Scientist', [
      { name: 'Machine Learning Engineer', idSuffix: 'machine_learning_engineer' },
      { name: 'AI Engineer', idSuffix: 'ai_engineer' },
    ]);
    addAliases('DevOps Engineer', [
      { name: 'Site Reliability Engineer', idSuffix: 'sre', category: 'Cloud & DevOps' },
      { name: 'Platform Engineer', idSuffix: 'platform_engineer', category: 'Cloud & DevOps' },
      { name: 'CloudOps Engineer', idSuffix: 'cloudops_engineer', category: 'Cloud & DevOps' },
    ]);
    addAliases('Cloud Engineer', [
      { name: 'Cloud Architect', idSuffix: 'cloud_architect' },
      { name: 'Infrastructure Engineer', idSuffix: 'infrastructure_engineer' },
    ]);
    addAliases('Security Engineer', [
      { name: 'Cybersecurity Engineer', idSuffix: 'cybersecurity_engineer' },
      { name: 'Security Analyst', idSuffix: 'security_analyst' },
    ]);
    addAliases('Network Engineer', [
      { name: 'Network Administrator', idSuffix: 'network_administrator' },
      { name: 'Network Support Engineer', idSuffix: 'network_support_engineer' },
    ]);
    addAliases('Support Engineer', [
      { name: 'Technical Support Engineer', idSuffix: 'technical_support_engineer' },
      { name: 'Production Support Engineer', idSuffix: 'production_support_engineer' },
      { name: 'IT Support Engineer', idSuffix: 'it_support_engineer' },
    ]);
    addAliases('Application Support Engineer', [
      { name: 'Applications Support Engineer', idSuffix: 'applications_support_engineer' },
    ]);

    return expanded;
  };

  const mapLocalCompany = (company: (typeof COMPANIES)[number]): Company => ({
    id: company.id,
    name: company.name,
    tier: company.category,
    hiringStatus: company.isHiring ? 'High' : 'Low',
    logo: company.logo,
    website: '',
    careersPage: '',
    linkedInUrl: '',
    rolesHiring: [],
    averageSalary: company.salary,
    hiringProcess: { steps: company.timeline.map((step, index) => ({ step: index + 1, name: step.step, duration: step.duration, tips: '' })) },
    commonQuestions: [],
    successStories: [],
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setRoles(expandRoles(localRoles.map(mapLocalRole)));
      setCompanies(COMPANIES.map(mapLocalCompany));

      // Check if user is logged in from localStorage
      const savedUser = localStorage.getItem('s4skillup_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser({ ...parsedUser, isLoggedIn: true });
        } catch (e) {
          console.error('Error parsing saved user:', e);
        }
      }
    };

    loadData();
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      careerLevel: null,
      isLoggedIn: true,
    };
    setUser(newUser);
    localStorage.setItem('s4skillup_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser({ id: '', email: '', careerLevel: null, isLoggedIn: false });
    localStorage.removeItem('s4skillup_user');
  };

  const setUserLevel = (level: UserLevel) => {
    setUser((prev) => ({ ...prev, careerLevel: level }));
    localStorage.setItem('s4skillup_user', JSON.stringify({ ...user, careerLevel: level }));
  };

  return (
    <AppContext.Provider value={{ user, roles, companies, selectedCompany, setSelectedCompany, login, logout, setUserLevel }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
