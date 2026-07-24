import React, { useMemo, useState } from 'react';
import { Company } from '../types';
import { useAppContext } from '../context/AppContext';

interface InterviewQuestion {
  id: string;
  title: string;
  question_text: string;
  difficulty: string;
  category: string;
}

interface Props {
  company: Company;
  onBack: () => void;
}

const QUESTION_BANK: Record<string, InterviewQuestion[]> = {
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

function getQuestions(companyName: string) {
  const key = companyName.toLowerCase();
  return [...(QUESTION_BANK[key] || []), ...QUESTION_BANK.default];
}

const InterviewPrepView: React.FC<Props> = ({ company }) => {
  const [activeTab, setActiveTab] = useState<'QUESTIONS' | 'PRACTICE' | 'RESOURCES' | 'TIPS'>('QUESTIONS');
  const { selectedCompany } = useAppContext();
  const displayCompany = selectedCompany || company;
  const questions = useMemo(() => getQuestions(displayCompany.name), [displayCompany.name]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="px-6 shrink-0 pt-4 lg:px-8 lg:pt-6">
        <h1 className="text-3xl font-bold mb-1 text-white lg:text-5xl">Interview Prep</h1>
        <p className="text-xs text-gray-500 font-mono">Get ready for {displayCompany.name}</p>

        <div className="flex border-b border-white/5 mt-6">
          {['QUESTIONS', 'PRACTICE', 'RESOURCES', 'TIPS'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`flex-1 py-3 text-[10px] font-mono tracking-widest transition-all ${
                activeTab === t ? 'text-neon-violet border-b-2 border-neon-violet bg-neon-violet/5' : 'text-gray-500'
              }`}
            >
              {t === 'PRACTICE' ? 'PRACTICE' : t}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-6 pb-24 lg:px-8 lg:pb-8">
        {activeTab === 'QUESTIONS' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6 px-1">
              <span className="text-[10px] font-mono text-gray-500">Showing {questions.length} questions from {displayCompany.name}</span>
              <div className="flex gap-2">
                <span className="w-4 h-1 bg-neon-cyan rounded-full"></span>
                <span className="w-4 h-1 bg-gray-700 rounded-full"></span>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {questions.map((q) => (
                <div key={q.id} className="glass-panel p-4 rounded-xl border-l-2 border-l-neon-violet">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-mono text-neon-violet bg-neon-violet/10 px-2 py-0.5 rounded">{q.category}</span>
                    <span className="text-[9px] font-mono text-gray-500 uppercase">{q.difficulty}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{q.title}</h4>
                  <p className="text-xs text-gray-400 mt-2">{q.question_text}</p>
                  <div className="flex justify-end mt-4">
                    <button className="text-[10px] font-mono text-primary font-bold hover:text-neon-cyan transition">SOLVE &gt;</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'PRACTICE' && (
          <div className="space-y-6 lg:max-w-3xl">
            <div className="glass-panel overflow-hidden rounded-2xl group">
              <div className="aspect-video bg-black/60 flex items-center justify-center relative">
                <span className="material-symbols-outlined text-6xl text-white/20 group-hover:text-neon-cyan group-hover:scale-110 transition-all cursor-pointer">play_circle</span>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 rounded text-[10px] font-mono text-white uppercase tracking-widest">Mock Interview Video</div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white mb-1">Watch how to answer</h4>
                <p className="text-xs text-gray-500">15 minutes - helpful tips</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'TIPS' && (
          <div className="space-y-8 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
            <section>
              <h3 className="text-[10px] font-mono text-neon-cyan tracking-widest uppercase mb-4 border-l-2 border-neon-cyan pl-2">Phone Screen</h3>
              <ul className="space-y-3">
                {['Quiet environment', 'Paper/Pen ready', 'Reliable connection', 'Smile while talking'].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-xs text-gray-400 items-center">
                    <span className="w-1 h-1 rounded-full bg-neon-cyan"></span> {tip}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-[10px] font-mono text-neon-violet tracking-widest uppercase mb-4 border-l-2 border-neon-violet pl-2">Salary Negotiation</h3>
              <div className="glass-panel p-4 rounded-xl border-neon-violet/20">
                <p className="text-xs text-gray-500 font-mono italic mb-4">"Always negotiate after the offer, never before."</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-white">
                    <span>Target Range</span>
                    <span className="text-neon-cyan">25-40 LPA</span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full">
                    <div className="w-3/4 h-full bg-neon-cyan"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'RESOURCES' && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { t: 'Cracking Coding', icon: 'book' },
              { t: 'NeetCode 150', icon: 'list' },
              { t: 'System Design', icon: 'hub' },
              { t: 'Behavioral Prep', icon: 'groups' }
            ].map((r, i) => (
              <button key={i} className="glass-panel p-4 rounded-xl flex flex-col items-center gap-3 hover:border-primary/50">
                <span className="material-symbols-outlined text-primary">{r.icon}</span>
                <span className="text-[10px] font-mono font-bold uppercase text-center">{r.t}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrepView;
