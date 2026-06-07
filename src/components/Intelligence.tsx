import React, { useState } from 'react';
import { Brain, Zap, TrendingUp, AlertTriangle, MessageSquare, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Intelligence = () => {
  const [insights] = useState([
    {
      id: 1,
      market: 'NBA: LAL @ GSW',
      score: 84,
      verdict: 'Heavy Sharp Inflow',
      analysis: 'Significant steam move detected across Pinnacle and Circa. Pro-bettor volume targeting GSW -3.5 before public pivot. Structural divergence confirms high-conviction Syndicate play.',
      confidence: 0.91,
      impact: 'HIGH'
    },
    {
      id: 2,
      market: 'NFL: KC @ LV',
      score: 72,
      verdict: 'Reverse Line Movement',
      analysis: 'Sharps are backing the Under despite 82% of public tickets on the Over. Total dropped from 48.5 to 47.0 in a 30-minute window. Classic weather-driven adjustment being front-run by institutional feeds.',
      confidence: 0.88,
      impact: 'MEDIUM'
    },
    {
      id: 3,
      market: 'EPL: MCI @ RMA',
      score: 91,
      verdict: 'Liquidity Anomaly',
      analysis: 'Abnormal volatility in the draw market. Inferred state suggests a high probability of institutional hedging. LBS™ Score peaked at 91 during early EU trading.',
      confidence: 0.94,
      impact: 'CRITICAL'
    }
  ]);

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Market Intelligence Feed</h2>
          <p className="text-slate-500 text-xs uppercase font-black tracking-widest mt-2 flex items-center gap-2">
            <Brain size={14} className="text-alpha-green" /> Powered by FAISS-Backed Structural Analysis
          </p>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-center">
              <p className="text-[8px] text-slate-600 uppercase font-black">Active Models</p>
              <p className="text-xs font-mono text-alpha-green">v4.2 PRO</p>
           </div>
        </div>
      </header>

      <div className="grid gap-6">
        {insights.map((insight, idx) => (
          <motion.div 
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bento-card group border-white/5"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-alpha-green/10 animate-pulse" />
                  <span className="text-xl font-black text-alpha-green italic relative z-10">{insight.score}</span>
                </div>
                <div>
                   <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{insight.market}</h3>
                   <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded inline-flex items-center gap-2 mt-2 ${
                     insight.impact === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 
                     insight.impact === 'HIGH' ? 'bg-alpha-green/20 text-alpha-green' : 'bg-blue-500/20 text-blue-500'
                   }`}>
                     <Zap size={10} /> {insight.verdict}
                   </span>
                </div>
              </div>
              <div className="hidden md:flex gap-8">
                 <div className="text-right">
                    <p className="text-[10px] text-slate-600 uppercase font-black mb-1">Confidence</p>
                    <p className="text-xl font-black text-white italic">{(insight.confidence * 100).toFixed(0)}%</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-slate-600 uppercase font-black mb-1">Impact</p>
                    <p className={`text-xl font-black italic ${insight.impact === 'CRITICAL' ? 'text-red-500' : 'text-white'}`}>{insight.impact}</p>
                 </div>
              </div>
            </div>

            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl relative">
               <MessageSquare className="absolute top-6 right-6 text-white/5" size={40} />
               <p className="text-slate-300 font-medium leading-relaxed italic text-lg mb-6">
                 "{insight.analysis}"
               </p>
               <div className="flex gap-4 border-t border-white/5 pt-6">
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <BarChart2 size={14} className="text-alpha-green" /> Sentiment Skew: <span className="text-white">SHARP_HEAVY</span>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-l border-white/10 pl-4">
                    <TrendingUp size={14} className="text-alpha-green" /> Probability Edge: <span className="text-white">+8.42%</span>
                 </div>
               </div>
            </div>

            <button className="mt-8 w-full py-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-alpha-green/30 hover:text-white hover:bg-alpha-green/5 transition-all">
              Initialize Contextual Replay for {insight.market.split(':')[1]}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
