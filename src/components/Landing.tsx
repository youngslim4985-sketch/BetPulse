import React from 'react';
import { 
  Zap, 
  Brain, 
  Database, 
  Activity, 
  ShieldCheck, 
  TrendingUp, 
  Cpu, 
  Target,
  BarChart3,
  Network
} from 'lucide-react';
import { motion } from 'framer-motion';

const EngineCard = ({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) => (
  <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] group hover:border-alpha-green/20 transition-all">
    <div className="w-12 h-12 bg-alpha-green/10 rounded-2xl flex items-center justify-center text-alpha-green mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4">{title}</h3>
    <p className="text-sm text-slate-400 font-medium leading-relaxed italic">{desc}</p>
  </div>
);

const ClassificationRow = ({ range, label, color, desc }: { range: string, label: string, color: string, desc: string }) => (
  <div className="flex items-center gap-6 p-4 border-b border-white/5 group hover:bg-white/[0.02] transition-colors">
    <div className="w-24 text-sm font-mono text-slate-500">{range}</div>
    <div className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest ${color}`}>
      {label}
    </div>
    <div className="flex-grow text-xs text-slate-400 italic">{desc}</div>
  </div>
);

export const Landing = () => {
  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12">
        <div className="grid grid-cols-12 gap-12 items-center">
          <div className="col-span-12 lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-alpha-green/10 border border-alpha-green/20 rounded-full mb-8">
              <Zap size={14} className="text-alpha-green" />
              <span className="text-[10px] text-alpha-green font-black uppercase tracking-widest">Powered by Line Breaker Score™ (LBS™)</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
              Breaking the <br />
              <span className="text-alpha-green">Line Before</span> <br />
              the Market Does.
            </h1>
            <p className="text-xl text-slate-400 font-medium italic mt-8 max-w-xl leading-relaxed">
              Track sharp money, detect line movement anomalies, and uncover predictive betting signals with institutional-grade market observability.
            </p>
            <div className="flex gap-6 mt-12">
              <button className="px-10 py-5 bg-alpha-green text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,65,0.3)]">
                Start Tracking Markets
              </button>
              <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all">
                View Intelligence Feed
              </button>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 relative">
            <div className="bento-card p-12 bg-black/60 backdrop-blur-3xl border-alpha-green/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-alpha-green/10 to-transparent opacity-50" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-48 h-48 relative mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                    <motion.circle
                      cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="553"
                      initial={{ strokeDashoffset: 553 }}
                      animate={{ strokeDashoffset: 553 - (553 * 0.88) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="text-alpha-green"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-6xl font-black text-white italic"
                    >
                      88
                    </motion.span>
                    <span className="text-xs text-alpha-green font-black uppercase tracking-widest mt-1">LBS™ Score</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="px-4 py-2 bg-alpha-green/20 rounded-xl inline-block mb-3">
                    <span className="text-sm font-black text-white italic uppercase tracking-tight">Strong Opportunity</span>
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">NBA: LAL @ GSW • Spread Market</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LBS Classification */}
      <section className="bento-card p-0 overflow-hidden border-white/5">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">LBS™ Score Classification</h2>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">The Industry Standard for Market Opportunity Assessment</p>
          </div>
          <Target className="text-alpha-green opacity-20" size={32} />
        </div>
        <div className="flex flex-col">
          <ClassificationRow 
            range="90–100" 
            label="Elite" 
            color="bg-alpha-green/20 text-alpha-green" 
            desc="Institutional-grade divergence. Syndicate-level conviction detected. Extreme edge probability."
          />
          <ClassificationRow 
            range="75–89" 
            label="Strong" 
            color="bg-yellow-500/20 text-yellow-500" 
            desc="Significant sharp money flow. Validated momentum signals with positive expected value."
          />
          <ClassificationRow 
            range="60–74" 
            label="Positive" 
            color="bg-blue-500/20 text-blue-500" 
            desc="Market tailwinds detected. Minor structural edge. Professional volume starting to build."
          />
          <ClassificationRow 
            range="40–59" 
            label="Neutral" 
            color="bg-slate-500/20 text-slate-400" 
            desc="Balanced market sentiment. No discernible structural advantage. High efficiency state."
          />
          <ClassificationRow 
            range="Below 40" 
            label="Avoid" 
            color="bg-red-500/20 text-red-500" 
            desc="Low liquidity or negative expected value. Public-heavy sentiment with adverse movement."
          />
        </div>
      </section>

      {/* Three Engines Grid */}
      <section>
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
            The Three Engines <br /> of Intelligence.
          </h2>
          <div className="w-24 h-1 bg-alpha-green rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <EngineCard 
            title="SharpMoneyEngine™" 
            icon={TrendingUp} 
            desc="Detects institutional bets and syndicate movements across major exchanges in sub-50ms latency. Separates signal from noise."
          />
          <EngineCard 
            title="AthleteIQ™" 
            icon={Brain} 
            desc="Proprietary behavioral modeling and performance telemetry. Predictive analytics for individual athlete trajectory and team dynamics."
          />
          <EngineCard 
            title="BayesianEngine™" 
            icon={Network} 
            desc="Automated self-correcting feedback loops. Every market outcome is ingested to recalibrate confidence priors for maximum precision."
          />
        </div>
      </section>

      {/* Investor Thesis */}
      <section className="relative py-24 px-8 lg:px-20 bg-dark-surface border border-alpha-green/10 rounded-[4rem] overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <ShieldCheck size={200} className="text-alpha-green" />
        </div>
        <div className="max-w-4xl relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="px-3 py-1 bg-alpha-green/10 border border-alpha-green/20 rounded text-[10px] font-black text-alpha-green uppercase tracking-widest">
              Investor Thesis
            </div>
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest italic">T&F Investments {" & "} Holdings LLC</span>
          </div>
          <blockquote className="text-3xl lg:text-4xl font-black text-white italic leading-tight tracking-tighter">
            "Line Breaker™ is not a betting app; it is a market observability platform. By treating sports markets as high-frequency financial exchanges, we provide the institutional-grade transparency previously reserved for Wall Street."
          </blockquote>
          <div className="mt-12 flex flex-col gap-2">
            <p className="text-sm font-black text-alpha-green uppercase tracking-[0.2em]">Motto:</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em]">We Play Clean. We Build Real. We Last Forever.</p>
          </div>
        </div>
      </section>

      {/* Positioning Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="col-span-1 md:col-span-2 p-12 bg-white/5 rounded-[3rem] border border-white/5 flex flex-col justify-center">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Strategic Positioning</h4>
            <div className="space-y-6">
              {[
                { label: 'Primary Brand Tagline', text: '"Breaking the Line Before the Market Does."', status: 'Active' },
                { label: 'Investor Positioning', text: '"Bloomberg Terminal for Sports Betting"', status: 'Active' },
                { label: 'Institutional Pitch', text: '"Quant-Driven Market Observability"', status: 'Approved' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <p className="text-[8px] text-slate-600 uppercase font-black mb-1">{item.label}</p>
                    <p className="text-xl font-black text-white italic tracking-tighter">{item.text}</p>
                  </div>
                  <span className="text-[10px] font-black italic text-alpha-green bg-alpha-green/10 px-2 py-1 rounded">{item.status}</span>
                </div>
              ))}
            </div>
        </div>
        <div className="p-12 bg-alpha-green rounded-[3rem] text-black flex flex-col justify-between group cursor-pointer overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
              <Cpu size={80} />
           </div>
           <div className="relative z-10">
             <BarChart3 className="mb-8" size={32} />
             <h4 className="text-3xl font-black italic leading-[0.9] uppercase tracking-tighter mb-4">Request <br /> Institutional <br /> Access</h4>
             <p className="text-xs font-black uppercase tracking-widest opacity-60">Reserved for Syndicates {" & "} HNWIs</p>
           </div>
           <button className="mt-12 w-full py-4 bg-black text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-zinc-900 transition-colors relative z-10">
              Initialize Onboarding
           </button>
        </div>
      </section>
    </div>
  );
};
