import React, { useState } from 'react';
import { 
  Activity, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Brain, 
  Droplets, 
  ChevronRight,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';

const AlphaDriver = ({ label, value, icon: Icon, color = "text-alpha-green" }: { label: string, value: number, icon: any, color?: string }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
    <div className="flex justify-between items-center">
      <div className={`p-2 bg-alpha-green/10 rounded-lg`}>
        <Icon size={14} className={color} />
      </div>
      <span className={`text-[10px] font-mono ${color}`}>{(value * 100).toFixed(0)}%</span>
    </div>
    <div className="mt-2">
      <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">{label}</p>
      <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          className={`h-full ${color.replace('text-', 'bg-')}/50`}
        />
      </div>
    </div>
  </div>
);

const PerformanceSignal = () => {
  const [stats] = useState({
    confidence: {
      overall: 0.92,
      completeness: 0.95,
      temporal_continuity: 0.88,
      provider_integrity: 0.99
    }
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Epistemic State Assessment</h3>
          <p className="text-[7px] text-slate-600 uppercase font-mono tracking-widest mt-0.5">Truth Lineage: ROOT {" > "} EVENT_BUS {" > "} CAS_PROJECTION</p>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-0.5 bg-alpha-green/10 text-alpha-green text-[7px] font-black rounded uppercase">Canonical Stream</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-5 flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <Zap size={32} className="text-alpha-green" />
          </div>
          
          <div className="relative w-36 h-36">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
              <motion.circle
                cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="402"
                initial={{ strokeDashoffset: 402 }}
                animate={{ strokeDashoffset: 402 - (402 * stats.confidence.overall) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-alpha-green"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white italic tracking-tighter">{(stats.confidence.overall * 100).toFixed(0)}</span>
              <span className="text-[8px] text-alpha-green uppercase font-black tracking-widest mt-1 italic">LBS™ Score</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-3">
          <AlphaDriver label="Sharp Density" value={stats.confidence.completeness} icon={TrendingUp} />
          <AlphaDriver label="Momentum Parity" value={stats.confidence.temporal_continuity} icon={Activity} />
          <AlphaDriver label="Market Integrity" value={stats.confidence.provider_integrity} icon={ShieldCheck} />
          <AlphaDriver label="Predictive Edge" value={0.88} icon={Brain} />
        </div>
      </div>

      <div className="flex justify-between items-center p-4 bg-black/40 border border-white/5 rounded-2xl">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-[7px] text-slate-600 uppercase font-black">Lineage Graph</span>
            <span className="text-[8px] text-slate-400 font-mono italic">EVENT_S_0x22F {" > "} INF_RECON_T+1</span>
          </div>
          <div className="flex flex-col border-l border-white/10 pl-6">
            <span className="text-[7px] text-slate-600 uppercase font-black">Divergence Risk</span>
            <span className="text-[8px] text-slate-400 font-mono italic">0.002% (NOMINAL)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Database size={12} className="text-alpha-green" />
          <span className="text-[8px] text-alpha-green uppercase font-black italic tracking-tighter">PROVENANCE_V2_AUDITABLE</span>
        </div>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-8">
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
                    <p className="text-[8px] text-slate-600 uppercase font-black">LBS™ Score</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="mt-8 w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Initialize Bulk Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
