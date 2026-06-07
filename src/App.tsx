import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { Intelligence } from './components/Intelligence';
import { Research } from './components/Research';
import { Portfolio } from './components/Portfolio';
import { ViewType } from './types';
import { Brain, Search, X, Database, ArrowUpRight, Cpu } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('LANDING');
  const [isIqOpen, setIsIqOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'LANDING': return <Landing />;
      case 'DASHBOARD': return <Dashboard />;
      case 'INTELLIGENCE': return <Intelligence />;
      case 'RESEARCH': return <Research />;
      case 'PORTFOLIO': return <Portfolio />;
      case 'MARKETS': return <Dashboard />; // Reuse dashboard for now as requested for pulse
      default: return <Landing />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="lg:pl-64 min-h-screen">
        <header className="fixed top-0 right-0 left-20 lg:left-64 h-24 border-b border-white/5 bg-dark-bg/80 backdrop-blur-xl z-30 px-8 flex items-center justify-between">
           <div>
              <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">{currentView}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                 <div className="w-1 h-1 bg-alpha-green rounded-full animate-pulse" />
                 <span className="text-[8px] text-slate-500 font-mono uppercase tracking-widest">Feed Status: SYNCED_v4.2</span>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsIqOpen(true)}
                className="px-6 py-2 bg-alpha-green/10 border border-alpha-green/20 text-alpha-green text-[10px] font-black rounded-full hover:bg-alpha-green hover:text-black transition-all uppercase tracking-widest flex items-center gap-2 group"
              >
                <Brain size={12} className="group-hover:animate-bounce" /> Global IQ
              </button>
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-alpha-green/10 to-transparent opacity-50" />
                 <span className="text-[10px] font-black relative z-10 font-mono italic">LB</span>
              </div>
           </div>
        </header>

        <main className="pt-32 p-8 lg:p-12 max-w-[1400px] mx-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* IQ Modal placeholder */}
      <AnimatePresence>
        {isIqOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 lg:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsIqOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-dark-surface border border-alpha-green/20 rounded-[3rem] p-8 lg:p-16 max-w-5xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-alpha-green rounded-2xl flex items-center justify-center shadow-2xl shadow-alpha-green/20">
                    <Brain size={32} className="text-black" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Game IQ Analyst<span className="text-alpha-green ml-1 lowercase align-top text-sm">™</span></h2>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1 italic">FAISS-Backed Structural Intelligence</p>
                  </div>
                </div>
                <button onClick={() => setIsIqOpen(false)} className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-10">
                 <div className="relative">
                   <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700" size={24} />
                   <input 
                    type="text" 
                    placeholder="Query market identity for deep structural breakdown..." 
                    className="w-full bg-black/60 border border-white/5 rounded-3xl py-8 pl-20 pr-8 text-xl text-white font-black italic focus:border-alpha-green/40 outline-none transition-all placeholder:text-slate-800"
                   />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-2 flex items-center gap-3">
                        <Database size={16} className="text-alpha-green" /> Canonical Registry
                       </h4>
                       <div className="space-y-4">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl flex justify-between items-center group hover:bg-alpha-green/5 hover:border-alpha-green/20 transition-all cursor-pointer">
                               <div className="flex items-center gap-4">
                                  <div className="w-2 h-2 bg-alpha-green rounded-full opacity-40 group-hover:opacity-100" />
                                  <span className="text-sm font-black text-slate-300 italic">Market_Identity_0xFB{i}</span>
                               </div>
                               <ArrowUpRight size={18} className="text-slate-600 group-hover:text-alpha-green transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="p-12 bg-alpha-green/5 border border-alpha-green/10 rounded-[3rem] flex flex-col justify-center items-center text-center group cursor-pointer relative overflow-hidden">
                       <div className="absolute inset-0 bg-alpha-green/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <Cpu size={64} className="text-alpha-green/40 mb-8 relative z-10 group-hover:scale-110 transition-transform" />
                       <h5 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 relative z-10">Initialize Model</h5>
                       <p className="text-xs text-slate-400 font-medium leading-relaxed italic relative z-10">
                         Perform structural parity checks and deep-state analysis on canonical records.
                       </p>
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

