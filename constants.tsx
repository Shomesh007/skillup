
import { Company, RoleCategory, SuccessStory } from './types';

export const COMPANIES: Company[] = [
  {
    id: 'google',
    name: 'Google',
    tagline: 'Organize the world\'s information.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    rating: 4.8,
    location: 'Mountain View, CA',
    salary: '25-45 LPA',
    experience: '0-3 Years',
    category: 'FAANG',
    isHiring: true,
    about: 'Google is a global leader in search, cloud computing, and AI technology.',
    stack: {
      frontend: ['React', 'Angular', 'TS'],
      backend: ['Go', 'C++', 'Java'],
      database: ['Spanner', 'Bigtable'],
      cloud: ['GCP', 'Kubernetes']
    },
    timeline: [
      { step: 'Initial Call', duration: '30m' },
      { step: 'Tech Interview 1', duration: '1h' },
      { step: 'Tech Interview 2', duration: '1h' },
      { step: 'Company Fit', duration: '45m' }
    ]
  },
  {
    id: 'nebula',
    name: 'Nebula AI',
    tagline: 'Pioneering Decentralized Compute.',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=nebula',
    rating: 4.5,
    location: 'Remote',
    salary: '18-30 LPA',
    experience: '1-5 Years',
    category: 'STARTUP',
    isHiring: true,
    about: 'Nebula AI focuses on scalable blockchain solutions for AI model training.',
    stack: {
      frontend: ['React', 'Next.js'],
      backend: ['Rust', 'Python'],
      database: ['PostgreSQL'],
      cloud: ['AWS', 'Docker']
    },
    timeline: [
      { step: 'First Call', duration: '20m' },
      { step: 'Project Task', duration: '48h' },
      { step: 'Final Interview', duration: '1.5h' }
    ]
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    tagline: 'Empower every person on the planet.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    rating: 4.6,
    location: 'Redmond, WA',
    salary: '22-40 LPA',
    experience: '0-5 Years',
    category: 'FAANG',
    isHiring: true,
    about: 'Microsoft enables digital transformation for the era of an intelligent cloud.',
    stack: {
      frontend: ['React', 'C#'],
      backend: ['C#', 'ASP.NET'],
      database: ['SQL Server'],
      cloud: ['Azure']
    },
    timeline: [
      { step: 'Quick Online Test', duration: '1.5h' },
      { step: 'Tech Interview 1', duration: '45m' },
      { step: 'Tech Interview 2', duration: '45m' },
      { step: 'Meeting Manager', duration: '1h' }
    ]
  }
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: '1',
    candidate: 'Priya S.',
    role: 'Data Scientist',
    companyId: 'microsoft',
    year: '2024',
    college: 'IIT Bombay',
    prevExperience: 'Fresher',
    ctc: '32 LPA',
    keyTakeaway: 'Focus deeply on SQL performance and business case studies.'
  },
  {
    id: '2',
    candidate: 'Arjun K.',
    role: 'SDE-1',
    companyId: 'google',
    year: '2023',
    college: 'BITS Pilani',
    prevExperience: '6mo Internship',
    ctc: '42 LPA',
    keyTakeaway: 'Googlyness round is as important as the coding rounds.'
  }
];

export const ROLE_CATEGORIES: RoleCategory[] = [
  {
    id: '01',
    title: 'Data and AI',
    icon: 'psychology',
    trending: 'Trending now',
    roles: ['Data Scientist', 'ML Engineer', 'Data Analyst', 'AI Researcher'],
    color: 'from-primary to-purple-500'
  },
  {
    id: '02',
    title: 'Cloud and Systems',
    icon: 'cloud_queue',
    trending: 'Many jobs',
    roles: ['DevOps Engineer', 'Cloud Architect', 'SRE'],
    color: 'from-cyan-400 to-primary'
  },
  {
    id: '03',
    title: 'Software Development',
    icon: 'code',
    trending: 'Always popular',
    roles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Software Engineer'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '04',
    title: 'Testing',
    icon: 'fact_check',
    trending: 'High demand',
    roles: ['QA Engineer', 'Automation Tester', 'Manual Tester', 'Performance Test Engineer', 'API Test Engineer', 'Validation Engineer'],
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: '05',
    title: 'Security',
    icon: 'shield',
    trending: 'Critical skills',
    roles: ['Security Engineer', 'Security Analyst', 'Cybersecurity Engineer'],
    color: 'from-emerald-400 to-cyan-500'
  },
  {
    id: '06',
    title: 'Support and Ops',
    icon: 'support_agent',
    trending: 'Steady demand',
    roles: ['Support Engineer', 'Application Support Engineer', 'Technical Support Engineer', 'Production Support Engineer'],
    color: 'from-slate-400 to-slate-600'
  }
];

// Added missing JOB_OPPORTUNITIES constant
export const JOB_OPPORTUNITIES = [
  {
    id: '1',
    company: 'Google',
    location: 'Mountain View, CA',
    salary: '25-45 LPA',
    experience: '0-3 Years',
    icon: 'corporate_fare',
    color: 'text-primary',
    isHiring: true,
    postedAt: '2 days ago',
    stack: ['React', 'Go', 'Kubernetes']
  },
  {
    id: '2',
    company: 'Nebula AI',
    location: 'Remote',
    salary: '18-30 LPA',
    experience: '1-5 Years',
    icon: 'rocket_launch',
    color: 'text-neon-cyan',
    isHiring: true,
    postedAt: '1 day ago',
    stack: ['Rust', 'Python', 'AWS']
  },
  {
    id: '3',
    company: 'Microsoft',
    location: 'Redmond, WA',
    salary: '22-40 LPA',
    experience: '0-5 Years',
    icon: 'dns',
    color: 'text-blue-400',
    isHiring: true,
    postedAt: '3 days ago',
    stack: ['C#', 'Azure', 'SQL']
  }
];
