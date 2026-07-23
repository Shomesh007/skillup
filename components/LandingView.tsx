
import React from 'react';

interface Props {
  onStart: () => void;
  onLogin: () => void;
}

const LandingView: React.FC<Props> = ({ onStart, onLogin }) => {
  return (
    <div className="flex-1 h-full flex flex-col p-6 overflow-y-auto no-scrollbar pb-32 lg:p-10 lg:pb-10">
      <header className="flex justify-between items-center mb-12 mt-6 shrink-0 lg:mt-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-cyan-500/50">S4</div>
          <span className="font-mono text-sm tracking-widest font-bold">S4SKILLUP</span>
        </div>
        <div className="flex gap-4">
          <button onClick={onLogin} className="text-xs font-mono text-gray-400 hover:text-white transition-colors">LOGIN</button>
          <button onClick={onLogin} className="text-xs font-mono text-cyan-400 font-bold hover:text-cyan-300 transition-colors">SIGN UP</button>
        </div>
      </header>

      <section className="mb-12 shrink-0 lg:grid lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-end lg:gap-12">
        <div>
        <h1 className="text-5xl font-bold leading-[1.1] mb-6 tracking-tight lg:text-7xl">
          Your Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">Starts Here</span>
        </h1>
        <p className="text-gray-400 mb-8 text-lg leading-relaxed lg:max-w-2xl">
          Navigate the Indian tech job market with confidence. Get real interview questions, salary insights, and proven strategies from 72+ companies.
        </p>
        </div>
        <button 
          onClick={onStart}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 group transition-all lg:h-16"
        >
          START MY JOURNEY
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </section>

      <section className="grid grid-cols-3 gap-4 mb-12 shrink-0 lg:max-w-3xl">
        {[
          { v: '72+', l: 'Companies' },
          { v: '37+', l: 'Roles' },
          { v: '96+', l: 'Questions' }
        ].map(s => (
          <div key={s.l} className="text-center p-3 glass-panel rounded-xl hover:border-cyan-500/50 transition-colors">
            <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{s.v}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">{s.l}</div>
          </div>
        ))}
      </section>

      <section className="mb-12 shrink-0">
        <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-6">Why s4skillup</h3>
        <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {[
            { n: '01', t: 'Real Interview Questions', d: 'Questions from actual interviews at top companies like TCS, Infosys, Google, Amazon, and more' },
            { n: '02', t: 'Salary Intelligence', d: 'Know what you should earn with percentile-based salary data by role and company' },
            { n: '03', t: 'Success Stories', d: 'Learn from real hiring journeys and career transitions of professionals like you' },
            { n: '04', t: 'Personalized Guidance', d: 'Get matched with roles based on your skills, experience, and career aspirations' }
          ].map(step => (
            <div key={step.n} className="flex gap-4 items-start p-3 rounded-lg hover:bg-white/5 transition-colors">
              <span className="text-cyan-400 font-mono font-bold text-lg">{step.n}</span>
              <div className="flex-1">
                <h4 className="font-bold text-white">{step.t}</h4>
                <p className="text-sm text-gray-500">{step.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 shrink-0">
        <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-6">Trusted by Companies</h3>
        <div className="grid grid-cols-4 gap-3 mb-6 lg:grid-cols-8">
          {['TCS', 'Infosys', 'Wipro', 'Amazon', 'Google', 'Zoho', 'Microsoft', 'Freshworks'].map(company => (
            <div key={company} className="aspect-square bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20 flex items-center justify-center text-xs font-mono font-bold text-gray-300 hover:border-cyan-500/50 transition-colors">
              {company}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 font-mono">... and 64+ more companies with real hiring data</p>
      </section>

      <section className="mb-12 shrink-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
        <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">What's Included</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {[
            '✓ Interview Prep',
            '✓ Salary Benchmarks',
            '✓ Company Insights',
            '✓ Role Guidance',
            '✓ ATS Resume Templates',
            '✓ Success Stories',
            '✓ Learning Paths',
            '✓ Career Chat AI',
            '✓ Progress Tracking'
          ].map((item, i) => (
            <div key={i} className="text-sm text-gray-300 flex items-center gap-2">
              <span className="text-cyan-400">{item.split(' ')[0]}</span>
              <span>{item.split(' ').slice(1).join(' ')}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 shrink-0">
        <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-6">Your Success Journey</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">📊</div>
            <div>
              <div className="font-semibold text-white text-sm">Assess</div>
              <div className="text-xs text-gray-500">Know your level & target role</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">🎯</div>
            <div>
              <div className="font-semibold text-white text-sm">Target</div>
              <div className="text-xs text-gray-500">Choose companies & roles</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">🚀</div>
            <div>
              <div className="font-semibold text-white text-sm">Prepare</div>
              <div className="text-xs text-gray-500">Real questions, tips, and strategies</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">🏆</div>
            <div>
              <div className="font-semibold text-white text-sm">Succeed</div>
              <div className="text-xs text-gray-500">Land your dream role</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-auto pt-8 border-t border-white/5 text-[10px] text-gray-600 font-mono flex justify-between uppercase shrink-0">
        <span>© 2026 s4skillup</span>
        <div className="flex gap-4">
          <span className="hover:text-gray-400 cursor-pointer transition-colors">About</span>
          <span className="hover:text-gray-400 cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-gray-400 cursor-pointer transition-colors">Contact</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingView;
