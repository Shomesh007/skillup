import { JobOpportunity } from '../../types';

export interface JobGuideProfile {
  normalizedTitle: string;
  family:
    | 'frontend'
    | 'backend'
    | 'fullstack'
    | 'software'
    | 'qa'
    | 'devops'
    | 'cloud'
    | 'data'
    | 'ml'
    | 'security'
    | 'network'
    | 'support'
    | 'mobile'
    | 'general';
  category: string;
  focusAreas: string[];
  resumeKeywords: string[];
  interviewKeywords: string[];
}

const SENIORITY_PREFIXES = [
  'principal',
  'staff',
  'lead',
  'senior',
  'sr',
  'jr',
  'junior',
  'associate',
  'intern',
  'entry level',
  'mid level',
  'mid senior',
  'mid-senior',
  'experienced',
];

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[_/.,()-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function hasUsableJobTitle(job?: Pick<JobOpportunity, 'title'> | null) {
  const title = job?.title?.trim();
  if (!title) return false;

  const normalized = normalizeText(title);
  if (!normalized) return false;

  const blocked = new Set([
    'na',
    'n a',
    'n a ',
    'unknown',
    'untitled',
    'job title',
    'job',
    'role',
    'position',
    'to be announced',
    'tba',
    'tbd',
  ]);

  return !blocked.has(normalized);
}

function hasAny(value: string, patterns: string[]) {
  return patterns.some((pattern) => value.includes(pattern));
}

function extractSeniorityPrefix(title: string) {
  const normalized = normalizeText(title);
  for (const prefix of SENIORITY_PREFIXES) {
    if (normalized.startsWith(`${prefix} `)) {
      return {
        prefix: title.trim().split(/\s+/).slice(0, prefix.split(' ').length).join(' '),
        remainder: title.trim().split(/\s+/).slice(prefix.split(' ').length).join(' '),
      };
    }
  }
  return { prefix: '', remainder: title.trim() };
}

function buildProfile(
  family: JobGuideProfile['family'],
  normalizedTitle: string,
  category: string,
  focusAreas: string[],
  resumeKeywords: string[],
  interviewKeywords: string[]
): JobGuideProfile {
  return {
    normalizedTitle,
    family,
    category,
    focusAreas,
    resumeKeywords,
    interviewKeywords,
  };
}

function classifyTesterTitle(searchable: string, titleForDisplay: (value: string) => string): JobGuideProfile {
  const isAutomation = hasAny(searchable, ['automation', 'automated', 'automation tester', 'test automation', 'qa automation', 'sdet', 'sde t']);
  const isPerformance = hasAny(searchable, ['performance', 'load testing', 'load test', 'stress testing', 'jmeter', 'gatling']);
  const isApi = hasAny(searchable, ['api test', 'api testing', 'rest assured', 'postman', 'service test']);
  const isMobile = hasAny(searchable, ['mobile', 'android', 'ios', 'appium', 'device testing']);
  const isEmbedded = hasAny(searchable, ['embedded', 'firmware', 'hardware', 'device validation']);
  const isData = hasAny(searchable, ['data test', 'data testing', 'etl', 'databricks', 'spark', 'sql validation']);
  const isValidation = hasAny(searchable, ['validation', 'regulatory', 'regulated', 'compliance', 'csv', 'gxp']);
  const isManual = hasAny(searchable, ['manual', 'functional', 'exploratory', 'smoke']) && !isAutomation;

  if (isEmbedded) {
    return buildProfile(
      'qa',
      titleForDisplay('Embedded Test Engineer'),
      'Testing',
      ['Embedded validation', 'Hardware/software integration', 'Python scripting', 'Debugging', 'Regression'],
      ['Embedded systems', 'Python', 'Oscilloscope basics', 'Test benches', 'Jira'],
      ['firmware validation', 'hardware interaction', 'signal basics', 'test coverage', 'debugging']
    );
  }

  if (isData) {
    return buildProfile(
      'qa',
      titleForDisplay('Data Test Engineer'),
      'Testing',
      ['Data quality', 'ETL validation', 'SQL checks', 'Pipeline testing', 'Automation'],
      ['SQL', 'Python', 'Databricks', 'Spark', 'Cucumber'],
      ['data reconciliation', 'pipeline integrity', 'schema checks', 'root cause analysis', 'test automation']
    );
  }

  if (isPerformance) {
    return buildProfile(
      'qa',
      titleForDisplay('Performance Test Engineer'),
      'Testing',
      ['Load testing', 'Stress testing', 'Bottleneck analysis', 'Monitoring', 'Reporting'],
      ['JMeter', 'LoadRunner', 'Grafana', 'K6', 'SQL'],
      ['throughput', 'latency', 'scalability', 'resource usage', 'bottlenecks']
    );
  }

  if (isApi) {
    return buildProfile(
      'qa',
      titleForDisplay('API Test Engineer'),
      'Testing',
      ['API validation', 'Contract testing', 'Automation', 'Collections', 'Error handling'],
      ['Postman', 'Rest Assured', 'Python', 'Java', 'Swagger'],
      ['status codes', 'payload validation', 'auth flows', 'negative tests', 'automation']
    );
  }

  if (isMobile) {
    return buildProfile(
      'qa',
      titleForDisplay('Mobile Test Engineer'),
      'Testing',
      ['Mobile app testing', 'Device matrix', 'Automation', 'Regression', 'Release validation'],
      ['Appium', 'Xcode', 'Android Studio', 'BrowserStack', 'TestFlight'],
      ['device compatibility', 'gesture flows', 'crash analysis', 'app store checks', 'release readiness']
    );
  }

  if (isValidation) {
    return buildProfile(
      'qa',
      titleForDisplay('Validation Engineer'),
      'Testing',
      ['Validation strategy', 'Traceability', 'Compliance', 'Documentation', 'Audit readiness'],
      ['Test scripts', 'Trace matrices', 'CSV', 'Jira', 'Excel'],
      ['requirements traceability', 'evidence collection', 'risk analysis', 'compliance', 'sign-off']
    );
  }

  if (isAutomation) {
    return buildProfile(
      'qa',
      titleForDisplay('QA Automation Engineer'),
      'Testing',
      ['Automation framework', 'CI/CD', 'UI automation', 'API automation', 'Reporting'],
      ['Selenium', 'Playwright', 'Cypress', 'TestNG', 'JUnit'],
      ['framework design', 'flaky tests', 'selectors', 'parallel runs', 'pipeline integration']
    );
  }

  if (isManual) {
    return buildProfile(
      'qa',
      titleForDisplay('Manual Tester'),
      'Testing',
      ['Manual test cases', 'Exploratory testing', 'Bug reporting', 'Regression', 'UAT'],
      ['Jira', 'TestRail', 'Excel', 'SQL basics', 'Browser DevTools'],
      ['test cases', 'edge cases', 'defect severity', 'repro steps', 'release confidence']
    );
  }

  return buildProfile(
    'qa',
    titleForDisplay('QA Engineer'),
    'Testing',
    ['Test design', 'Automation', 'Bug reporting', 'Regression testing', 'CI/CD'],
    ['Selenium', 'Postman', 'TestNG/JUnit', 'Playwright', 'Git'],
    ['test strategy', 'edge cases', 'automation coverage', 'defect triage', 'quality mindset']
  );
}

export function classifyJobGuide(job?: Pick<JobOpportunity, 'title' | 'description' | 'skills'> | null): JobGuideProfile {
  const rawTitle = hasUsableJobTitle(job) ? job!.title.trim() : 'Technology Role';
  const rawDescription = normalizeText(job?.description || '');
  const title = normalizeText(rawTitle);
  const { prefix, remainder } = extractSeniorityPrefix(rawTitle);
  const seniorityPrefix = prefix ? `${prefix} ` : '';
  const baseTitle = normalizeText(remainder || rawTitle);
  const titleForDisplay = (value: string) => `${seniorityPrefix}${value}`.trim();
  const skillText = normalizeText((job?.skills || []).join(' '));
  const searchable = `${title} ${baseTitle} ${rawDescription} ${skillText}`.trim();

  if (hasAny(searchable, ['front end', 'frontend', 'ui developer', 'ui engineer', 'web developer', 'react js', 'react developer'])) {
    const titleVariant = hasAny(searchable, ['react']) ? 'React Developer' : 'Frontend Developer';
    return buildProfile(
      'frontend',
      titleForDisplay(titleVariant),
      'Frontend',
      ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Responsive UI'],
      ['React', 'TypeScript', 'CSS', 'API integration', 'component architecture'],
      ['state management', 'accessibility', 'performance', 'component design', 'debugging']
    );
  }

  if (hasAny(searchable, ['full stack', 'fullstack', 'mern', 'mean', 'mevn'])) {
    return buildProfile(
      'fullstack',
      titleForDisplay('Full Stack Developer'),
      'Full Stack',
      ['Frontend', 'Backend', 'APIs', 'Databases', 'Deployment'],
      ['React', 'Node.js', 'REST APIs', 'SQL', 'Git'],
      ['system design basics', 'trade-offs', 'API design', 'ownership', 'delivery']
    );
  }

  if (hasAny(searchable, ['back end', 'backend', 'api developer', 'server side', 'node developer', 'java developer', 'python developer', 'golang developer', 'go developer'])) {
    const titleVariant = hasAny(searchable, ['java']) ? 'Java Developer' : hasAny(searchable, ['python']) ? 'Python Developer' : hasAny(searchable, ['golang', 'go developer']) ? 'Go Developer' : 'Backend Developer';
    return buildProfile(
      'backend',
      titleForDisplay(titleVariant),
      'Backend',
      ['APIs', 'Databases', 'Authentication', 'Scalability', 'Testing'],
      ['Node.js', 'Java', 'Python', 'SQL', 'REST APIs'],
      ['data modeling', 'error handling', 'system design', 'performance', 'security']
    );
  }

  if (hasAny(searchable, ['qa', 'quality assurance', 'tester', 'test engineer', 'testing', 'validation', 'sdet'])) {
    return classifyTesterTitle(searchable, titleForDisplay);
  }

  if (hasAny(searchable, ['devops', 'site reliability', 'sre', 'platform engineer', 'infrastructure engineer', 'ci cd', 'ci/cd'])) {
    const titleVariant = hasAny(searchable, ['sre']) ? 'Site Reliability Engineer' : hasAny(searchable, ['platform']) ? 'Platform Engineer' : 'DevOps Engineer';
    return buildProfile(
      'devops',
      titleForDisplay(titleVariant),
      'Cloud & DevOps',
      ['Linux', 'Containers', 'CI/CD', 'Monitoring', 'Infrastructure as Code'],
      ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'Jenkins'],
      ['automation', 'incident response', 'reliability', 'observability', 'release pipelines']
    );
  }

  if (hasAny(searchable, ['cloud', 'aws', 'azure', 'gcp', 'icloud'])) {
    return buildProfile(
      'cloud',
      titleForDisplay('Cloud Engineer'),
      'Cloud & DevOps',
      ['Cloud architecture', 'Networking', 'Security', 'Automation', 'Cost optimization'],
      ['AWS', 'Azure', 'GCP', 'Terraform', 'CloudWatch'],
      ['scalability', 'least privilege', 'cost control', 'resilience', 'IaC']
    );
  }

  if (hasAny(searchable, ['data engineer', 'etl', 'data pipeline', 'warehouse', 'spark', 'hadoop'])) {
    return buildProfile(
      'data',
      titleForDisplay('Data Engineer'),
      'Data & AI',
      ['SQL', 'Pipelines', 'Data modeling', 'Batch/stream processing', 'ETL'],
      ['Python', 'SQL', 'Spark', 'Airflow', 'dbt'],
      ['data quality', 'pipeline reliability', 'schema design', 'performance', 'orchestration']
    );
  }

  if (hasAny(searchable, ['data scientist', 'machine learning', 'ml engineer', 'ai engineer', 'ai/ml', 'artificial intelligence'])) {
    const titleVariant = hasAny(searchable, ['data scientist']) ? 'Data Scientist' : hasAny(searchable, ['ml engineer']) ? 'Machine Learning Engineer' : 'AI Engineer';
    return buildProfile(
      'ml',
      titleForDisplay(titleVariant),
      'Data & AI',
      ['Statistics', 'Feature engineering', 'Model training', 'Evaluation', 'Deployment'],
      ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow/PyTorch', 'SQL'],
      ['experimentation', 'bias/variance', 'feature selection', 'metrics', 'production readiness']
    );
  }

  if (hasAny(searchable, ['security', 'cyber', 'information security', 'soc', 'appsec'])) {
    const titleVariant = hasAny(searchable, ['engineer']) ? 'Security Engineer' : 'Cybersecurity Analyst';
    return buildProfile(
      'security',
      titleForDisplay(titleVariant),
      'Security',
      ['Threat modeling', 'Vulnerability management', 'Networking', 'Linux', 'Compliance'],
      ['OWASP', 'Nmap', 'Wireshark', 'Kali Linux', 'SIEM'],
      ['risk analysis', 'incident response', 'hardening', 'monitoring', 'secure coding']
    );
  }

  if (hasAny(searchable, ['network', 'networking', 'routing', 'switching', 'telecom'])) {
    return buildProfile(
      'network',
      titleForDisplay('Network Engineer'),
      'Networking',
      ['Routing', 'Switching', 'TCP/IP', 'Troubleshooting', 'Network security'],
      ['Cisco', 'Wireshark', 'Nmap', 'VPN', 'Linux'],
      ['network design', 'protocols', 'latency', 'redundancy', 'incident handling']
    );
  }

  if (hasAny(searchable, ['support engineer', 'technical support', 'application support', 'production support', 'customer support'])) {
    const titleVariant = hasAny(searchable, ['application support']) ? 'Application Support Engineer' : hasAny(searchable, ['technical support']) ? 'Technical Support Engineer' : 'Support Engineer';
    return buildProfile(
      'support',
      titleForDisplay(titleVariant),
      'Support',
      ['Troubleshooting', 'Monitoring', 'Escalation handling', 'Documentation', 'Automation'],
      ['SQL', 'Linux', 'Python', 'ServiceNow/Jira', 'Splunk'],
      ['root cause analysis', 'communication', 'prioritization', 'handoffs', 'SLA management']
    );
  }

  if (hasAny(searchable, ['mobile', 'android', 'ios', 'flutter', 'react native'])) {
    return buildProfile(
      'mobile',
      titleForDisplay('Mobile Developer'),
      'Mobile',
      ['App architecture', 'Platform SDKs', 'UI performance', 'State management', 'APIs'],
      ['Android', 'Kotlin', 'Swift', 'Flutter', 'React Native'],
      ['app lifecycle', 'navigation', 'performance', 'offline support', 'release process']
    );
  }

  if (hasAny(searchable, ['developer', 'engineer', 'programmer', 'software'])) {
    const titleVariant = hasAny(searchable, ['software engineer', 'custom software engineer', 'application engineer']) ? 'Software Engineer' : 'Software Developer';
    return buildProfile(
      'software',
      titleForDisplay(titleVariant),
      'Software Development',
      ['Programming fundamentals', 'APIs', 'Debugging', 'Testing', 'Deployment'],
      ['JavaScript', 'TypeScript', 'Python', 'Java', 'Git'],
      ['problem solving', 'code quality', 'collaboration', 'ownership', 'delivery']
    );
  }

  return buildProfile(
    'general',
    titleForDisplay(rawTitle),
    'Technology',
    ['Resume tailoring', 'Role fundamentals', 'Projects', 'Communication', 'Interview practice'],
    ['Git', 'Documentation', 'problem solving', 'communication', 'project storytelling'],
    ['adaptability', 'learning agility', 'ownership', 'stakeholder communication', 'execution']
  );
}
