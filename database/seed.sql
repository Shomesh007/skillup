-- =================================================================
-- QuickJob Data Seeding Scripts
-- Use these to bootstrap initial data after schema creation
-- =================================================================

-- ==================== SEED ROLES ====================

INSERT INTO roles (name, slug, category, description, difficulty, time_to_mastery, required_skills)
VALUES
  ('Full Stack Developer', 'full-stack-developer', 'Backend', 'Develop web applications across frontend and backend', 'Mid', '12-18 months', ARRAY['JavaScript', 'React', 'Node.js', 'SQL', 'REST APIs']),
  ('Frontend Developer', 'frontend-developer', 'Frontend', 'Build user interfaces with HTML, CSS, JavaScript', 'Entry', '6-12 months', ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript']),
  ('Backend Developer', 'backend-developer', 'Backend', 'Build server-side applications and APIs', 'Mid', '12-18 months', ARRAY['Node.js', 'Python', 'Java', 'Databases', 'REST APIs']),
  ('Software Engineer', 'software-engineer', 'Backend', 'Design and build reliable software systems across the stack', 'Mid', '9-15 months', ARRAY['Programming', 'Debugging', 'Git', 'Testing', 'System Design Basics']),
  ('Java Developer', 'java-developer', 'Backend', 'Build enterprise applications and services using Java', 'Mid', '9-15 months', ARRAY['Java', 'Spring Boot', 'SQL', 'REST APIs', 'Git']),
  ('Python Developer', 'python-developer', 'Backend', 'Build backend services, automation, and scripting solutions', 'Entry', '6-12 months', ARRAY['Python', 'SQL', 'APIs', 'Git', 'Testing']),
  ('React Developer', 'react-developer', 'Frontend', 'Build modern user interfaces with React', 'Entry', '6-12 months', ARRAY['React', 'TypeScript', 'JavaScript', 'CSS', 'API Integration']),
  ('QA Engineer', 'qa-engineer', 'QA', 'Validate product quality through manual and automated testing', 'Entry', '6-12 months', ARRAY['Testing', 'Selenium', 'Postman', 'Jira', 'Git']),
  ('Test Engineer', 'test-engineer', 'QA', 'Design and execute functional and regression test plans', 'Entry', '6-12 months', ARRAY['Test Cases', 'Regression Testing', 'SQL', 'Jira', 'Debugging']),
  ('Automation Tester', 'automation-tester', 'QA', 'Automate end-to-end tests and reduce manual testing effort', 'Entry', '6-12 months', ARRAY['Selenium', 'Playwright', 'Java/Python', 'CI/CD', 'Git']),
  ('Manual Tester', 'manual-tester', 'QA', 'Execute manual test cases and exploratory testing for product quality', 'Entry', '6-12 months', ARRAY['Test Cases', 'Exploratory Testing', 'Jira', 'Excel', 'Bug Reporting']),
  ('Performance Test Engineer', 'performance-test-engineer', 'QA', 'Validate load, stress, and scalability characteristics of applications', 'Mid', '9-15 months', ARRAY['JMeter', 'LoadRunner', 'Grafana', 'SQL', 'Performance Analysis']),
  ('API Test Engineer', 'api-test-engineer', 'QA', 'Test APIs, contracts, and service integrations', 'Entry', '6-12 months', ARRAY['Postman', 'Rest Assured', 'Swagger', 'Python', 'Java']),
  ('Validation Engineer', 'validation-engineer', 'QA', 'Validate regulated systems with traceability and compliance evidence', 'Mid', '9-15 months', ARRAY['Traceability Matrix', 'CSV', 'Jira', 'Documentation', 'Risk Analysis']),
  ('Mobile Test Engineer', 'mobile-test-engineer', 'QA', 'Test Android and iOS applications across devices and release cycles', 'Entry', '6-12 months', ARRAY['Appium', 'Android Studio', 'Xcode', 'BrowserStack', 'TestFlight']),
  ('Data Test Engineer', 'data-test-engineer', 'QA', 'Validate ETL pipelines, data quality, and warehouse outputs', 'Mid', '9-15 months', ARRAY['SQL', 'Python', 'Spark', 'Databricks', 'Cucumber']),
  ('Data Engineer', 'data-engineer', 'Data', 'Build data pipelines and data processing systems', 'Mid', '12-18 months', ARRAY['Python', 'SQL', 'Spark', 'ETL', 'Airflow']),
  ('Machine Learning Engineer', 'machine-learning-engineer', 'Data', 'Deploy ML models and production AI systems', 'Senior', '18-24 months', ARRAY['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'MLOps']),
  ('Security Engineer', 'security-engineer', 'Security', 'Build and monitor secure systems and controls', 'Mid', '12-18 months', ARRAY['Security', 'Networking', 'Linux', 'SIEM', 'OWASP']),
  ('Network Engineer', 'network-engineer', 'Cloud', 'Design and maintain reliable networks and connectivity', 'Mid', '12-18 months', ARRAY['Networking', 'Routing', 'Switching', 'Linux', 'Troubleshooting']),
  ('Support Engineer', 'support-engineer', 'Business', 'Resolve production issues and support customers and internal teams', 'Entry', '6-12 months', ARRAY['Troubleshooting', 'SQL', 'Linux', 'Communication', 'Monitoring']),
  ('Application Support Engineer', 'application-support-engineer', 'Business', 'Support enterprise applications and production operations', 'Mid', '9-15 months', ARRAY['Linux', 'SQL', 'Monitoring', 'Incident Response', 'Automation']),
  ('Data Scientist', 'data-scientist', 'Data', 'Analyze data and build machine learning models', 'Senior', '18-24 months', ARRAY['Python', 'SQL', 'Machine Learning', 'Statistics', 'TensorFlow']),
  ('Data Analyst', 'data-analyst', 'Data', 'Extract and analyze business data', 'Entry', '6-12 months', ARRAY['SQL', 'Python', 'Excel', 'Tableau', 'Statistics']),
  ('DevOps Engineer', 'devops-engineer', 'DevOps', 'Manage infrastructure, CI/CD, and cloud deployment', 'Mid', '12-18 months', ARRAY['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux']),
  ('Cloud Engineer', 'cloud-engineer', 'Cloud', 'Design and deploy cloud-based solutions', 'Mid', '12-18 months', ARRAY['AWS', 'Azure', 'GCP', 'Terraform', 'Networking']),
  ('Security Analyst', 'security-analyst', 'Security', 'Identify and mitigate security vulnerabilities', 'Senior', '18-24 months', ARRAY['OWASP', 'Networking', 'Linux', 'Python', 'Penetration Testing']),
  ('QA Automation Engineer', 'qa-automation-engineer', 'QA', 'Automate testing and quality assurance processes', 'Entry', '6-12 months', ARRAY['Selenium', 'Python', 'JavaScript', 'Testing Frameworks', 'SQL']),
  ('Business Analyst', 'business-analyst', 'Business', 'Analyze business requirements and create specifications', 'Entry', '6-12 months', ARRAY['Communication', 'SQL', 'Excel', 'Requirements Analysis', 'Domain Knowledge']);

-- ==================== SEED COMPANIES ====================

INSERT INTO companies (name, slug, description, category, tier, remote_policy, hiring_status)
VALUES
  ('Google', 'google', 'Search, advertising, and cloud computing giant', 'FAANG', 'Enterprise', 'Hybrid', 'High'),
  ('Amazon', 'amazon', 'E-commerce and cloud services leader', 'FAANG', 'Enterprise', 'Office Only', 'High'),
  ('Microsoft', 'microsoft', 'Software and cloud services company', 'FAANG', 'Enterprise', 'Hybrid', 'Moderate'),
  ('Zoho', 'zoho', 'SaaS product company based in India', 'PRODUCT', 'Mid-tier', 'Hybrid', 'High'),
  ('Freshworks', 'freshworks', 'Customer engagement software company', 'STARTUP', 'Mid-tier', 'Hybrid', 'High'),
  ('TCS', 'tcs', 'Large Indian IT services and consulting company', 'SERVICE', 'Enterprise', 'Hybrid', 'Moderate'),
  ('Infosys', 'infosys', 'Global IT services and consulting company', 'SERVICE', 'Enterprise', 'Hybrid', 'Moderate'),
  ('Wipro', 'wipro', 'IT services and digital transformation company', 'SERVICE', 'Enterprise', 'Office Only', 'Low'),
  ('Chargebee', 'chargebee', 'SaaS billing and subscription platform', 'STARTUP', 'Mid-tier', 'Fully Remote', 'Moderate'),
  ('Aspire Systems', 'aspire-systems', 'Product engineering and digital transformation services', 'SERVICE', 'Mid-tier', 'Hybrid', 'Moderate');

-- ==================== SEED LEARNING RESOURCES ====================

INSERT INTO learning_resources (role_id, skill_name, skill_category, resource_type, title, url, platform, estimated_hours, difficulty, is_free)
SELECT
  r.id,
  'JavaScript Fundamentals',
  'Frontend',
  'course',
  'The Complete JavaScript Course',
  'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
  'freeCodeCamp',
  40,
  'beginner',
  true
FROM roles r WHERE r.slug = 'frontend-developer'
UNION ALL
SELECT
  r.id,
  'React Framework',
  'Frontend',
  'course',
  'React Complete Guide',
  'https://www.freecodecamp.org/learn/front-end-development-libraries/react/',
  'freeCodeCamp',
  30,
  'intermediate',
  true
FROM roles r WHERE r.slug = 'frontend-developer'
UNION ALL
SELECT
  r.id,
  'SQL Database Design',
  'Backend',
  'course',
  'SQL and Database Fundamentals',
  'https://www.youtube.com/watch?v=qw-aGhArxyQ',
  'YouTube',
  10,
  'beginner',
  true
FROM roles r WHERE r.slug = 'backend-developer'
UNION ALL
SELECT
  r.id,
  'Node.js Backend Development',
  'Backend',
  'course',
  'Complete Node.js Developer',
  'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
  'freeCodeCamp',
  50,
  'intermediate',
  true
FROM roles r WHERE r.slug = 'backend-developer'
UNION ALL
SELECT
  r.id,
  'Docker & Kubernetes',
  'DevOps',
  'video',
  'Docker Crash Course',
  'https://www.youtube.com/watch?v=fqMOX6JJhGo',
  'YouTube',
  4,
  'beginner',
  true
FROM roles r WHERE r.slug = 'devops-engineer'
UNION ALL
SELECT
  r.id,
  'AWS Cloud Services',
  'Cloud',
  'course',
  'AWS Solutions Architect Associate',
  'https://www.youtube.com/watch?v=Ia-UEYYR44s',
  'YouTube',
  40,
  'intermediate',
  true
FROM roles r WHERE r.slug = 'cloud-engineer'
UNION ALL
SELECT
  r.id,
  'Python for Data Science',
  'Data',
  'course',
  'Python for Data Analysis',
  'https://www.freecodecamp.org/learn/data-analysis-with-python/',
  'freeCodeCamp',
  50,
  'beginner',
  true
FROM roles r WHERE r.slug = 'data-scientist';

-- ==================== SEED INTERVIEW QUESTIONS ====================

-- Backend Developer - System Design Questions
INSERT INTO interview_questions (role_id, title, question_text, difficulty, category, source_platform)
SELECT
  r.id,
  'Design a URL Shortening Service',
  'Design a system that takes long URLs and shortens them to unique 6-character identifiers. Must handle 100M requests/day.',
  'Senior',
  'System Design',
  'custom'
FROM roles r WHERE r.slug = 'backend-developer'
UNION ALL
SELECT
  r.id,
  'Design a Message Queue System',
  'Design a message queue system similar to RabbitMQ or Kafka that handles high throughput and guarantees message delivery.',
  'Senior',
  'System Design',
  'custom'
FROM roles r WHERE r.slug = 'backend-developer'
UNION ALL
SELECT
  r.id,
  'Reverse a Linked List',
  'Write code to reverse a linked list. Can you do it iteratively and recursively?',
  'Mid',
  'Coding',
  'custom'
FROM roles r WHERE r.slug = 'backend-developer'
UNION ALL
SELECT
  r.id,
  'Implement a Cache LRU',
  'Implement an LRU (Least Recently Used) Cache with O(1) get and put operations.',
  'Mid',
  'Coding',
  'custom'
FROM roles r WHERE r.slug = 'backend-developer'
UNION ALL
SELECT
  r.id,
  'REST API Best Practices',
  'What are REST API best practices? How would you design a robust API? Discuss versioning, error handling, and pagination.',
  'Mid',
  'Behavioral',
  'custom'
FROM roles r WHERE r.slug = 'backend-developer';

-- Frontend Developer - React Questions
INSERT INTO interview_questions (role_id, title, question_text, difficulty, category, source_platform)
SELECT
  r.id,
  'React Hooks vs Class Components',
  'Explain the differences between React Hooks and Class Components. When would you use each?',
  'Mid',
  'Behavioral',
  'custom'
FROM roles r WHERE r.slug = 'frontend-developer'
UNION ALL
SELECT
  r.id,
  'Virtual DOM Reconciliation',
  'How does React Virtual DOM work? Explain the diffing algorithm.',
  'Senior',
  'Behavioral',
  'custom'
FROM roles r WHERE r.slug = 'frontend-developer'
UNION ALL
SELECT
  r.id,
  'Implement Debounce Function',
  'Write a debounce function in JavaScript. What are its use cases?',
  'Mid',
  'Coding',
  'custom'
FROM roles r WHERE r.slug = 'frontend-developer'
UNION ALL
SELECT
  r.id,
  'Event Bubbling vs Capturing',
  'Explain event bubbling and event capturing. What is the difference?',
  'Mid',
  'Behavioral',
  'custom'
FROM roles r WHERE r.slug = 'frontend-developer';

-- Data Analyst Questions
INSERT INTO interview_questions (role_id, title, question_text, difficulty, category, source_platform)
SELECT
  r.id,
  'SQL Joins Explained',
  'Explain INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN. Give examples for each.',
  'Entry',
  'Coding',
  'custom'
FROM roles r WHERE r.slug = 'data-analyst'
UNION ALL
SELECT
  r.id,
  'Complex SQL Query',
  'Write SQL to find the top 3 customers by total spending with their purchase frequency.',
  'Mid',
  'Coding',
  'custom'
FROM roles r WHERE r.slug = 'data-analyst'
UNION ALL
SELECT
  r.id,
  'Data Visualization Best Practices',
  'What are best practices for data visualization? How do you choose appropriate charts for different data types?',
  'Entry',
  'Behavioral',
  'custom'
FROM roles r WHERE r.slug = 'data-analyst';

-- ==================== SEED SALARY BENCHMARKS ====================

INSERT INTO salary_benchmarks (company_id, role_id, level, base_25th_percentile, base_50th_percentile, base_75th_percentile, bonus_avg, equity_annual_value, data_points, confidence)
SELECT
  c.id,
  r.id,
  'L4',
  150000,
  180000,
  220000,
  30000,
  200000,
  50,
  4.5
FROM companies c JOIN roles r ON c.slug = 'google' AND r.slug = 'backend-developer'
UNION ALL
SELECT
  c.id,
  r.id,
  'L5',
  250000,
  300000,
  380000,
  60000,
  500000,
  40,
  4.8
FROM companies c JOIN roles r ON c.slug = 'google' AND r.slug = 'backend-developer'
UNION ALL
SELECT
  c.id,
  r.id,
  'L4',
  160000,
  190000,
  240000,
  25000,
  180000,
  35,
  4.2
FROM companies c JOIN roles r ON c.slug = 'amazon' AND r.slug = 'backend-developer'
UNION ALL
SELECT
  c.id,
  r.id,
  'Mid',
  50000000,
  65000000,
  80000000,
  10000000,
  0,
  20,
  3.5
FROM companies c JOIN roles r ON c.slug = 'zoho' AND r.slug = 'backend-developer'
UNION ALL
SELECT
  c.id,
  r.id,
  'Mid',
  25000000,
  35000000,
  45000000,
  5000000,
  0,
  15,
  3.0
FROM companies c JOIN roles r ON c.slug = 'tcs' AND r.slug = 'backend-developer';

-- ==================== SEED COMPANY INTERVIEW ROUNDS ====================

INSERT INTO company_interview_rounds (company_id, round_number, round_name, duration_minutes, focus_areas, pass_rate_percentage)
SELECT
  c.id,
  1,
  'Initial Phone Screening',
  30,
  ARRAY['Communication', 'Background', 'Motivation'],
  70
FROM companies c WHERE c.slug = 'google'
UNION ALL
SELECT
  c.id,
  2,
  'Technical Interview - Coding',
  60,
  ARRAY['DSA', 'Algorithms', 'Problem Solving'],
  40
FROM companies c WHERE c.slug = 'google'
UNION ALL
SELECT
  c.id,
  3,
  'Technical Interview - System Design',
  60,
  ARRAY['System Design', 'Scalability', 'Trade-offs'],
  35
FROM companies c WHERE c.slug = 'google'
UNION ALL
SELECT
  c.id,
  4,
  'Behavioral Interview',
  45,
  ARRAY['Leadership', 'Collaboration', 'Impact'],
  50
FROM companies c WHERE c.slug = 'google'
UNION ALL
SELECT
  c.id,
  1,
  'Online Assessment',
  90,
  ARRAY['DSA', 'Coding', 'Aptitude'],
  50
FROM companies c WHERE c.slug = 'tcs'
UNION ALL
SELECT
  c.id,
  2,
  'Technical Interview',
  60,
  ARRAY['DSA', 'Languages', 'Problem Solving'],
  45
FROM companies c WHERE c.slug = 'tcs'
UNION ALL
SELECT
  c.id,
  3,
  'HR Round',
  30,
  ARRAY['Communication', 'Cultural Fit', 'Expectations'],
  80
FROM companies c WHERE c.slug = 'tcs';

-- ==================== VERIFY SEEDING ====================

-- Check counts
SELECT 'Roles' as table_name, COUNT(*) as count FROM roles
UNION ALL
SELECT 'Companies', COUNT(*) FROM companies
UNION ALL
SELECT 'Learning Resources', COUNT(*) FROM learning_resources
UNION ALL
SELECT 'Interview Questions', COUNT(*) FROM interview_questions
UNION ALL
SELECT 'Salary Benchmarks', COUNT(*) FROM salary_benchmarks
UNION ALL
SELECT 'Interview Rounds', COUNT(*) FROM company_interview_rounds;

-- Done! Initial data seeded.
