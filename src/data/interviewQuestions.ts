export interface InterviewQuestion {id:string;title:string;question_text:string;difficulty:string;category:string;}
export const QUESTION_BANK: Record<string, InterviewQuestion[]> = {
  default: [
    { id: 'q1', title: 'Tell me about yourself', question_text: 'Walk through your background and explain why this role fits your current goals.', difficulty: 'Entry', category: 'Behavioral' },
    { id: 'q2', title: 'Most challenging project', question_text: 'Share the hardest project you worked on and what you learned from it.', difficulty: 'Mid', category: 'Behavioral' },
    { id: 'q3', title: 'Bug fix walkthrough', question_text: 'Explain how you identified, fixed, and validated a recent bug or issue.', difficulty: 'Entry', category: 'Coding' },
    { id: 'q4', title: 'Why this company?', question_text: 'Show that you understand the company, product, and team direction.', difficulty: 'Entry', category: 'Behavioral' },
    { id: 'q5', title: 'Handling ambiguity', question_text: 'Talk through how you make progress when requirements are incomplete.', difficulty: 'Mid', category: 'Behavioral' },
  ],
  google: [
    { id: 'g1', title: 'Scalable service design', question_text: 'Design a service that can scale cleanly and explain your trade-offs.', difficulty: 'Mid', category: 'System Design' },
    { id: 'g2', title: 'Algorithm fundamentals', question_text: 'Solve a coding problem and explain your time and space complexity.', difficulty: 'Entry', category: 'Coding' },
  ],
  microsoft: [
    { id: 'm1', title: 'Cross-team collaboration', question_text: 'Describe how you work with product, design, and engineering teams.', difficulty: 'Entry', category: 'Behavioral' },
    { id: 'm2', title: 'Debugging approach', question_text: 'Walk through how you would investigate and isolate a production issue.', difficulty: 'Mid', category: 'Coding' },
  ],
  amazon: [
    { id: 'a1', title: 'Ownership story', question_text: 'Share an example that demonstrates ownership and customer obsession.', difficulty: 'Entry', category: 'Behavioral' },
    { id: 'a2', title: 'System scaling', question_text: 'How would you design for high traffic, reliability, and observability?', difficulty: 'Mid', category: 'System Design' },
  ],
  tcs: [
    { id: 't1', title: 'Project delivery', question_text: 'Explain how you delivered a feature from requirements to release.', difficulty: 'Entry', category: 'Behavioral' },
  ],
  infosys: [
    { id: 'i1', title: 'Client communication', question_text: 'How do you manage expectation and scope with a client or stakeholder?', difficulty: 'Entry', category: 'Behavioral' },
  ],
};


