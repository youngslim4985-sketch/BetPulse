import React, { useState } from 'react';
import { Database, Clock, Search, Filter, BarChart3, Binary } from 'lucide-react';
import { motion } from 'framer-motion';

export const Research = () => {
  const [history] = useState([
    { id: 'TX-9012', timestamp: '2026-05-20 18:42:01', market: 'NBA:LAL@GSW', type: 'CAS_SYNC', confidence: 0.98, entropy: 0.0012, status: 'CANONICAL' },
    { id: 'TX-9011', timestamp: '2026-05-20 18:41:58', market: 'NBA:LAL@GSW', type: 'GAP_FILL', confidence: 0.72, entropy: 0.1420, status: 'INFERRED' },
    { id: 'TX-9010', timestamp: '2026-05-20 18:41:55', market: 'NFL:KC@LV', type: 'CAS_SYNC', confidence: 0.99, entropy: 0.0008, status: 'CANONICAL' },
    { id: 'TX-9009', timestamp: '2026-05-20 18:41:52', market: 'MLB:NYY@BOS', type: 'PROV_AUDIT', confidence: 0.95, entropy: 0.0045, status: 'AUDITED' },
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Quant Research Engine</h2>
          <p className="text-slate-500 text-xs uppercase font-black tracking-widest mt-2 flex items-center gap-2">
            <Database size={14} className="text-alpha-green" /> Institutional Odds Replay {" & "} CLV Analysis
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2">
            <Filter size={14} /> Refine Dataset
          </button>
          <button className="px-6 py-3 bg-alpha-green text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
             Export Parity Log
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bento-card p-0 overflow-hidden min-h-[600px] flex flex-col">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
             <div className="flex items-center gap-4">
                <Clock size={20} className="text-alpha-green" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Historical State Registry</h3>
             </div>
             <div className="relative">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input 
                  type="text" 
                  placeholder="Query Transaction ID / Market..." 
                  className="bg-black/40 border border-white/5 rounded-full py-2 pl-10 pr-4 text-[10px] text-white focus:border-alpha-green/40 outline-none w-64"
                />
             </div>
          </div>

          <div className="flex-grow overflow-y-auto scrollbar-hide">
            <table className="w-full text-left">
              <thead className="bg-white/[0.02] sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Descriptor</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Market Entity</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Projection Type</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Certainty</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Entropy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {history.map((row, i) => (
                  <motion.tr 
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/[0.02] cursor-pointer transition-all group"
                  >
                    <td className="px-8 py-6">
                      <p className="text-[10px] font-mono text-alpha-green mb-1">{row.id}</p>
                      <p className="text-[8px] text-slate-600 uppercase font-black">{row.timestamp}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-black text-white italic tracking-tighter">{row.market}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                        row.status === 'CANONICAL' ? 'bg-alpha-green/10 text-alpha-green' : 
                        row.status === 'INFERRED' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{width: 0}} animate={{width: `${row.confidence * 100}%`}} className="h-full bg-alpha-green/40" />
                         </div>
                         <span className="text-[9px] font-mono text-slate-400">{(row.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-[10px] font-mono text-slate-500 group-hover:text-white transition-colors">{row.entropy.toFixed(4)}</p>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
           <div className="bento-card">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
                <BarChart3 size={14} className="text-alpha-green" /> CLV Overlap Density
              </h3>
              <div className="h-48 w-full border-l border-b border-white/5 relative flex items-end px-4 gap-2">
                 {[40, 70, 45, 90, 60, 30, 85].map((h, i) => (
                   <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="flex-grow bg-alpha-green/20 rounded-t-sm group relative"
                   >
                     <div className="absolute inset-x-0 top-0 h-1 bg-alpha-green opacity-0 group-hover:opacity-100 transition-opacity" />
                   </motion.div>
                 ))}
                 <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                    {[1, 2, 3].map(i => <div key={i} className="w-full h-px bg-white/[0.02]" />)}
                 </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                 <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="text-[8px] text-slate-600 uppercase font-black mb-1">Mean Gap CLV</p>
                    <p className="text-xl font-black text-white italic">+2.14%</p>
                 </div>
                 <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="text-[8px] text-slate-600 uppercase font-black mb-1">LBS™ Parity</p>
                    <p className="text-xl font-black text-alpha-green italic">0.9922</p>
                 </div>
              </div>
           </div>

           <div className="bento-card flex-grow bg-alpha-green/[0.02] border-alpha-green/10">
              <Binary size={32} className="text-alpha-green/40 mb-6" />
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">Initialize Backtest</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed italic mb-8">
                Run high-fidelity replay of market microstructure against proprietary alpha models to detect latent edge decay.
              </p>
              <button className="w-full py-4 bg-alpha-green/10 border border-alpha-green/30 text-alpha-green text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] hover:bg-alpha-green hover:text-black transition-all">
                Access Replay Console
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
