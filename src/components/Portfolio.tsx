import React from 'react';
import { User, Wallet, PieChart, ArrowUpRight, TrendingUp, History } from 'lucide-react';
import { motion } from 'framer-motion';

export const Portfolio = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Portfolio Intelligence</h2>
          <p className="text-slate-500 text-xs uppercase font-black tracking-widest mt-2 flex items-center gap-2">
            <User size={14} className="text-alpha-green" /> Behavioral ROI {" & "} Emotional Pattern Detection
          </p>
        </div>
        <div className="bg-alpha-green/10 border border-alpha-green/20 px-6 py-4 rounded-3xl flex flex-col items-end">
           <span className="text-[8px] text-alpha-green uppercase font-black tracking-widest">Active Stake</span>
           <span className="text-2xl font-black text-white italic">14.82Ξ</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
           <div className="bento-card">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
                <PieChart size={14} className="text-alpha-green" /> Asset Allocation
              </h3>
              <div className="flex justify-center py-6">
                <div className="relative w-40 h-40">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-white/5" />
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="15" fill="transparent" strokeDasharray="440" strokeDashoffset="120" className="text-alpha-green" />
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="15" fill="transparent" strokeDasharray="440" strokeDashoffset="380" className="text-blue-500" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Yield</span>
                      <span className="text-2xl font-black text-white italic">+12.4%</span>
                   </div>
                </div>
              </div>
              <div className="space-y-3 mt-6">
                 {[
                   { label: 'NBA Spread', val: '42%', color: 'bg-alpha-green' },
                   { label: 'NFL Props', val: '28%', color: 'bg-blue-500' },
                   { label: 'Soccer Total', val: '18%', color: 'bg-slate-700' },
                 ].map(item => (
                   <div key={item.label} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${item.color}`} />
                         <span className="text-slate-400">{item.label}</span>
                      </div>
                      <span className="text-white">{item.val}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bento-card flex flex-col justify-between">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Behavioral Risk</h3>
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
                   <p className="text-[9px] text-red-500 font-black uppercase mb-1 italic">Pattern Detected: Tilt Bias</p>
                   <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">
                     Higher stake velocity detected after 2 consecutive losses in late-night NBA markets.
                   </p>
                </div>
              </div>
              <div className="mt-8">
                 <div className="flex justify-between text-[8px] font-black uppercase tracking-widest mb-2">
                    <span className="text-slate-600">Emotional Stability</span>
                    <span className="text-white">68%</span>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[68%] h-full bg-red-500/40" />
                 </div>
              </div>
           </div>
        </div>

        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
           <div className="bento-card flex-grow">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                   <History size={14} className="text-alpha-green" /> Open Tickets {" & "} Live EV
                 </h3>
                 <span className="text-[8px] font-mono text-slate-600 italic">LAST_UPDATE: T-2s</span>
              </div>
              
              <div className="space-y-4">
                 {[1, 2, 3, 4].map(i => (
                   <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex justify-between items-center group hover:border-alpha-green/20 transition-all">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-xs font-black text-white italic">
                            {['LAL', 'KC', 'GSW', 'NYY'][i-1]}
                         </div>
                         <div>
                            <p className="text-sm font-black text-white italic tracking-tighter uppercase whitespace-nowrap">Market_Ticket_00{i}</p>
                            <div className="flex gap-3 items-center mt-1">
                               <span className="text-[8px] text-slate-600 uppercase font-black">Stake: 0.52Ξ</span>
                               <span className="text-[8px] text-alpha-green uppercase font-black italic">Live EV: +4.2%</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="text-right">
                            <p className="text-[8px] text-slate-600 uppercase font-black">Real-Time Delta</p>
                            <p className="text-lg font-black text-white font-mono italic">{(Math.random() * 2).toFixed(4)}</p>
                         </div>
                         <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-500 group-hover:text-alpha-green transition-colors">
                            <ArrowUpRight size={18} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
              
              <button className="mt-8 w-full py-4 border border-dashed border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-alpha-green/20 hover:text-white transition-all">
                Manual Ticket Ingestion
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
