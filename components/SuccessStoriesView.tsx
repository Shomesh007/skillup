import React from 'react';
import { Company } from '../types';
import { useAppContext } from '../context/AppContext';

interface SuccessStory {
  id: string;
  target_role: string;
  ctc_annual: number;
  total_prep_time_weeks: number;
  situation: string;
  key_takeaway: string;
}

interface Props {
  company: Company;
  onBack: () => void;
}

const LOCAL_STORIES: Record<string, SuccessStory[]> = {
  default: [
    {
      id: 's1',
      target_role: 'Software Engineer',
      ctc_annual: 3200000,
      total_prep_time_weeks: 10,
      situation: 'Focused on fundamentals, built two projects, and practiced interviews weekly.',
      key_takeaway: 'Specificity wins. Show impact, not just tools.',
    },
    {
      id: 's2',
      target_role: 'QA Engineer',
      ctc_annual: 1400000,
      total_prep_time_weeks: 8,
      situation: 'Prepared test cases, automation basics, and solid bug reporting examples.',
      key_takeaway: 'Quality roles reward structured thinking and clear communication.',
    },
  ],
  google: [
    {
      id: 'g1',
      target_role: 'SDE-1',
      ctc_annual: 4200000,
      total_prep_time_weeks: 12,
      situation: 'Built DSA speed, system design basics, and a strong internship story.',
      key_takeaway: 'Practice explaining trade-offs and keep your solutions simple.',
    },
  ],
  microsoft: [
    {
      id: 'm1',
      target_role: 'Frontend Engineer',
      ctc_annual: 3100000,
      total_prep_time_weeks: 9,
      situation: 'Showed UI craftsmanship, accessibility awareness, and teamwork examples.',
      key_takeaway: 'Speak clearly about collaboration and product thinking.',
    },
  ],
  amazon: [
    {
      id: 'a1',
      target_role: 'Backend Engineer',
      ctc_annual: 3600000,
      total_prep_time_weeks: 11,
      situation: 'Highlighted ownership stories and one production-ready API project.',
      key_takeaway: 'Every answer should connect back to ownership and customer impact.',
    },
  ],
};

function getStories(companyName: string) {
  const key = companyName.toLowerCase();
  return [...(LOCAL_STORIES[key] || []), ...LOCAL_STORIES.default];
}

const SuccessStoriesView: React.FC<Props> = ({ company }) => {
  const { selectedCompany } = useAppContext();
  const displayCompany = selectedCompany || company;
  const stories = getStories(displayCompany.name);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar">
      <header className="p-6 shrink-0 pt-4 lg:p-8 lg:pb-4">
        <h1 className="text-3xl font-bold mb-1 text-white lg:text-5xl">Experience Stories</h1>
        <p className="text-xs text-gray-500 font-mono">Stories from people who got hired at {displayCompany.name}</p>
      </header>

      <section className="px-6 mb-8 lg:px-8">
        <div className="glass-panel p-4 rounded-xl flex justify-around border-neon-amber/30 bg-neon-amber/5">
          <div className="text-center">
            <div className="text-xl font-bold text-neon-amber">{stories.length}</div>
            <div className="text-[8px] text-gray-500 uppercase">Stories</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-neon-amber">4-6w</div>
            <div className="text-[8px] text-gray-500 uppercase">Avg Prep</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-neon-amber">65%</div>
            <div className="text-[8px] text-gray-500 uppercase">Hire Rate</div>
          </div>
        </div>
      </section>

      <div className="px-6 space-y-6 pb-24 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-5 lg:space-y-0 lg:px-8 lg:pb-8">
        {stories.map((story) => (
          <div key={story.id} className="glass-panel p-6 rounded-2xl">
            <div className="flex gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary text-xl">
                👤
              </div>
              <div>
                <h3 className="font-bold text-white">Anonymous</h3>
                <p className="text-[10px] font-mono text-gray-500 uppercase">{story.target_role}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                <span className="text-gray-500">Prep Time</span>
                <span className="text-gray-300">{story.total_prep_time_weeks} weeks</span>
              </div>
              <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                <span className="text-gray-500">Status</span>
                <span className="text-neon-cyan font-mono font-bold">✓ HIRED</span>
              </div>
              <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                <span className="text-gray-500">Salary</span>
                <span className="text-neon-cyan font-mono font-bold">₹{(story.ctc_annual / 100000).toFixed(1)} LPA</span>
              </div>
            </div>

            <div className="bg-black/40 p-4 rounded-xl border border-neon-amber/20">
              <div className="text-[9px] font-mono text-neon-amber uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">lightbulb</span> Story
              </div>
              <p className="text-sm text-gray-400 italic font-mono leading-relaxed">
                "{story.key_takeaway || story.situation}"
              </p>
            </div>

            <button className="w-full mt-4 py-3 bg-primary/10 text-primary font-bold rounded-xl border border-primary/20 hover:bg-primary/20 transition-all text-[10px] font-mono tracking-widest uppercase">
              READ FULL STORY
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStoriesView;
