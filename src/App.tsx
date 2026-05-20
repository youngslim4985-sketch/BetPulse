import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Brain, 
  Layers, 
  ArrowUpRight, 
  Database, 
  Cpu, 
  Zap, 
  BarChart3, 
  Droplets, 
  Wind, 
  TrendingUp,
  ShieldCheck,
  Search,
  X,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface PerformanceStats {
  alphaScore: number;
  decayRate: number;
  drivers: {
    momentum: number;
    volatility: number;
    sentiment: number;
    liquidity: number;
  };
  metadata: {
    nodeId: string;
    latency: string;
    version: string;
  };
}

// --- Components ---

const AlphaDriver = ({ label, value, icon: Icon }: { label: string, value: number, icon: any }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
    <div className="flex justify-between items-center">
      <div className="p-2 bg-alpha-green/10 rounded-lg">
        <Icon size={14} className="text-alpha-green" />
      </div>
      <span className="text-[10px] font-mono text-alpha-green">{(value * 100).toFixed(0)}%</span>
    </div>
    <div className="mt-2">
      <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">{label}</p>
      <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          className="h-full bg-alpha-green/50"
        />
      </div>
    </div>
  </div>
);

const PerformanceSignal = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    alphaScore: 84.2,
    decayRate: 0.12,
    drivers: {
      momentum: 0.92,
      volatility: 0.45,
      sentiment: 0.78,
      liquidity: 0.88,
    },
    metadata: {
      nodeId: "ST-X4-0xFB",
      latency: "42ms",
      version: "v4.2.1"
    }
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Real-Time Performance Signal</h3>
          <p className="text-[7px] text-slate-600 uppercase font-mono tracking-widest mt-0.5">Vector Parity: CID-90122</p>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-0.5 bg-alpha-green/10 text-alpha-green text-[8px] font-black rounded uppercase">Live Ingestion</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Score Ring */}
        <div className="col-span-12 md:col-span-5 flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <Zap size={40} className="text-alpha-green" />
          </div>
          
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="440"
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * stats.alphaScore) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-alpha-green"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white italic tracking-tighter">{stats.alphaScore.toFixed(1)}</span>
              <span className="text-[9px] text-alpha-green uppercase font-black tracking-widest mt-1 italic">Alpha Score</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-alpha-green rounded-full animate-pulse" />
              <span className="text-[9px] font-mono text-slate-400">SIGNAL DECAY: {stats.decayRate}%/sec</span>
            </div>
          </div>
        </div>

        {/* Alpha Drivers */}
        <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-4">
          <AlphaDriver label="Momentum" value={stats.drivers.momentum} icon={TrendingUp} />
          <AlphaDriver label="Volatility" value={stats.drivers.volatility} icon={Activity} />
          <AlphaDriver label="Sentiment" value={stats.drivers.sentiment} icon={Brain} />
          <AlphaDriver label="Liquidity" value={stats.drivers.liquidity} icon={Droplets} />
        </div>
      </div>

      {/* Meta Bar */}
      <div className="flex justify-between items-center p-4 bg-black/40 border border-white/5 rounded-2xl">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-[7px] text-slate-600 uppercase font-black">Node Identity</span>
            <span className="text-[9px] text-slate-400 font-mono">{stats.metadata.nodeId}</span>
          </div>
          <div className="flex flex-col border-l border-white/10 pl-6">
            <span className="text-[7px] text-slate-600 uppercase font-black">Latency</span>
            <span className="text-[9px] text-slate-400 font-mono italic">{stats.metadata.latency}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={12} className="text-alpha-green" />
          <span className="text-[9px] text-alpha-green uppercase font-black italic tracking-tighter">Symmetric CAS Enabled</span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isIqOpen, setIsIqOpen] = useState(false);

  return (
    <div className="min-h-screen p-8 md:p-12 lg:p-16 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-alpha-green rounded-2xl flex items-center justify-center text-black font-black text-3xl shadow-[0_0_30px_rgba(0,255,65,0.3)]">
            LB
          </div>
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Line Breaker<span className="text-alpha-green ml-1 lowercase">™</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 bg-alpha-green rounded-full animate-pulse" />
              Real-Time Event Ingestion Engine
            </p>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-4">
          <button 
            onClick={() => setIsIqOpen(true)}
            className="px-6 py-2.5 bg-alpha-green/10 border border-alpha-green/30 text-alpha-green text-[11px] font-black rounded-full hover:bg-alpha-green transition-all hover:text-black uppercase tracking-widest flex items-center gap-2"
          >
            <Brain size={14} /> Analyze Game IQ
          </button>
          <div className="px-6 py-2.5 bg-dark-surface border border-dark-border rounded-full flex items-center gap-3">
             <Layers size={14} className="text-alpha-green" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FAISS v1.2.4</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-12 gap-8">
        {/* Left Column: Market Intelligence */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-8">
          <div className="bento-card">
            <PerformanceSignal />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="bento-card flex flex-col justify-between">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Execution Depth</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] font-mono text-slate-400">Order_0{i}</span>
                      <span className="text-[10px] font-mono text-alpha-green">{(Math.random() * 1000).toFixed(2)}Ξ</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 hover:text-alpha-green transition-colors">
                View Full Depth <ChevronRight size={12} />
              </button>
            </div>

            <div className="bento-card flex flex-col justify-between">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Anomaly Detection</h3>
                <div className="flex flex-col gap-4">
                  <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <p className="text-[9px] text-red-500 font-black uppercase">Outlier Alert</p>
                    <p className="text-[10px] text-slate-300 mt-1">Abnormal betting volume detected on NBA:LAL@GSW</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-between items-center">
                <span className="text-[9px] font-mono text-slate-600">THREAT LEVEL: LOW</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-1 h-3 rounded-full ${i < 3 ? 'bg-red-500/40' : 'bg-white/5'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sharp Feed */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
          <div className="bento-card h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Ingestion Feed</h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-alpha-green rounded-full animate-ping" />
                <span className="text-[9px] text-alpha-green font-mono">STREAMING</span>
              </div>
            </div>

            <div className="space-y-6 flex-grow overflow-y-auto scrollbar-hide pr-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 bg-white/5 border border-white/5 rounded-3xl group hover:border-alpha-green/20 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black border border-white/10 rounded-xl flex items-center justify-center text-[10px] font-black text-alpha-green">
                        {['NB', 'NF', 'ML', 'SC'][i % 4]}
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-white italic tracking-tighter">Team_A vs Team_B</p>
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest">Main Market • Total {220.5 + i}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-black text-alpha-green italic tracking-tighter">+{70 + i * 2}</p>
                      <p className="text-[8px] text-slate-600 uppercase font-black">Edge Score</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="mt-8 w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-slate-200 transition-all">
              Initialize Bulk Analysis
            </button>
          </div>
        </div>
      </main>

      {/* IQ Modal placeholder */}
      <AnimatePresence>
        {isIqOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsIqOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-dark-surface border border-alpha-green/20 rounded-[3rem] p-12 max-w-4xl w-full max-h-[85vh] overflow-hidden"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-alpha-green rounded-xl flex items-center justify-center shadow-lg shadow-alpha-green/20">
                    <Brain size={24} className="text-black" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Game IQ Analyst<span className="text-alpha-green ml-1 lowercase align-top text-sm">™</span></h2>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1 italic">FAISS-Backed Structural Intelligence</p>
                  </div>
                </div>
                <button onClick={() => setIsIqOpen(false)} className="text-slate-500 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                 <div className="relative">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                   <input 
                    type="text" 
                    placeholder="Search market for analytical breakdown..." 
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-6 pl-16 pr-6 text-white font-black italic focus:border-alpha-green/40 outline-none transition-all placeholder:text-slate-700"
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-6 lg:gap-10">
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Database size={14} className="text-alpha-green" /> Canonical Registry
                       </h4>
                       <div className="space-y-3">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group hover:bg-alpha-green/5 transition-all">
                               <span className="text-[11px] font-black text-slate-300 italic">Market_Identity_0{i}</span>
                               <ArrowUpRight size={14} className="text-slate-600 group-hover:text-alpha-green" />
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="p-8 bg-alpha-green/5 border border-alpha-green/10 rounded-[2rem] flex flex-col justify-center items-center text-center">
                       <Cpu size={48} className="text-alpha-green/40 mb-6" />
                       <h5 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Initialize Model</h5>
                       <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">Select a canonical market record to perform structural parity checks and deep-slate analysis.</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
