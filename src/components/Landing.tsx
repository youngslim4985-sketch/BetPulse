import React, { useState } from 'react';
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
  Network, 
  ArrowUpRight, 
  Users, 
  Sliders, 
  DollarSign, 
  Trophy, 
  Sparkles, 
  Play, 
  Flame, 
  ShieldAlert, 
  BarChart, 
  FileText, 
  Map, 
  HelpCircle,
  PieChart,
  Layers,
  CheckCircle,
  Calendar,
  Layers3,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// --- DATA TYPES ---
interface GameDemoData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  schedule: string;
  lbsScore: number;
  confidenceTier: 'ELITE' | 'STRONG' | 'POSITIVE' | 'NEUTRAL' | 'AVOID';
  badgeColor: string;
  textColor: string;
  marketDescription: string;
  
  // SharpMoneyEngine™ Data
  openingSpread: string;
  currentSpread: string;
  volumeObserved: string;
  sharpDensity: number; // percentage
  averageTickLatency: string;
  syndicatesInvolved: string[];
  recentTicks: { time: string; spread: number; volume: number; isSharp: boolean }[];

  // BayesianConfidenceLayer™ Data
  priorCoverProbability: number;
  posteriorAdjustment: string;
  finalBayesianPosterior: number;
  evidenceWeight: string;

  // Truth Firewall Status
  firewallLatency: string;
  tickIntegrityPass: boolean;
  sentimentAnomaliesDetected: boolean;
  consensusVerification: 'VERIFIED' | 'NOMINAL' | 'ALERT';
}

// --- DATASETS ---
const GAMES_LIST: GameDemoData[] = [
  {
    id: 'game-1',
    homeTeam: 'Buffalo Bills',
    awayTeam: 'Kansas City Chiefs',
    league: 'NFL',
    schedule: 'Sunday • 4:25 PM EST',
    lbsScore: 92,
    confidenceTier: 'ELITE',
    badgeColor: 'bg-alpha-green/20 text-alpha-green border-alpha-green/30',
    textColor: 'text-alpha-green',
    marketDescription: 'Spread Line Cover • Host Arena',
    openingSpread: 'Bills +2.5',
    currentSpread: 'Bills -1.0',
    volumeObserved: '$14,240,500',
    sharpDensity: 82,
    averageTickLatency: '18ms',
    syndicatesInvolved: ['Chicago Syndicate LLC', 'MGM Ingress Whale Unit', 'Nevada Alpha Fund'],
    recentTicks: [
      { time: '13:02', spread: 2.5, volume: 450000, isSharp: false },
      { time: '13:45', spread: 2.0, volume: 1500000, isSharp: true },
      { time: '14:10', spread: 1.5, volume: 2200000, isSharp: true },
      { time: '14:32', spread: 0.5, volume: 800000, isSharp: false },
      { time: '15:15', spread: -1.0, volume: 3400000, isSharp: true }
    ],
    priorCoverProbability: 51.5,
    posteriorAdjustment: '+22.0% Base Postulates Variance',
    finalBayesianPosterior: 73.5,
    evidenceWeight: 'CRITICAL (3 Wave Consensus)',
    firewallLatency: '12ms',
    tickIntegrityPass: true,
    sentimentAnomaliesDetected: false,
    consensusVerification: 'VERIFIED'
  },
  {
    id: 'game-2',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Boston Celtics',
    league: 'NBA',
    schedule: 'Tonight • 8:30 PM EST',
    lbsScore: 78,
    confidenceTier: 'STRONG',
    badgeColor: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    textColor: 'text-yellow-500',
    marketDescription: 'Match Spread Alternative Line',
    openingSpread: 'Lakers -3.5',
    currentSpread: 'Lakers -1.5',
    volumeObserved: '$18,910,200',
    sharpDensity: 71,
    averageTickLatency: '24ms',
    syndicatesInvolved: ['Tri-State Ingestion Pool', 'Costa Rica Private Anchor'],
    recentTicks: [
      { time: '16:15', spread: -3.5, volume: 800000, isSharp: false },
      { time: '17:00', spread: -3.0, volume: 2100000, isSharp: true },
      { time: '18:10', spread: -2.5, volume: 3100000, isSharp: true },
      { time: '19:40', spread: -1.5, volume: 4500000, isSharp: true }
    ],
    priorCoverProbability: 44.2,
    posteriorAdjustment: '+13.8% Evidence Cover',
    finalBayesianPosterior: 58.0,
    evidenceWeight: 'HIGH SIGNALS COVARIANCE',
    firewallLatency: '16ms',
    tickIntegrityPass: true,
    sentimentAnomaliesDetected: false,
    consensusVerification: 'NOMINAL'
  },
  {
    id: 'game-3',
    homeTeam: 'Boston Red Sox',
    awayTeam: 'New York Yankees',
    league: 'MLB',
    schedule: 'Saturday • 7:10 PM EST',
    lbsScore: 49,
    confidenceTier: 'NEUTRAL',
    badgeColor: 'bg-slate-500/20 text-slate-400 border-white/10',
    textColor: 'text-slate-400',
    marketDescription: 'Total Runs Line Over/Under',
    openingSpread: 'Total 8.5 Under',
    currentSpread: 'Total 8.0 Under',
    volumeObserved: '$8,405,800',
    sharpDensity: 54,
    averageTickLatency: '35ms',
    syndicatesInvolved: ['General Public Retail Ingress'],
    recentTicks: [
      { time: '09:00', spread: 8.5, volume: 400000, isSharp: false },
      { time: '11:15', spread: 8.5, volume: 550000, isSharp: false },
      { time: '13:00', spread: 8.0, volume: 1500000, isSharp: true },
      { time: '15:30', spread: 8.0, volume: 900000, isSharp: false }
    ],
    priorCoverProbability: 50.1,
    posteriorAdjustment: '-2.3% Public Noise Decay',
    finalBayesianPosterior: 47.8,
    evidenceWeight: 'LOW CONFIDENCE WEIGHT',
    firewallLatency: '25ms',
    tickIntegrityPass: true,
    sentimentAnomaliesDetected: true,
    consensusVerification: 'NOMINAL'
  },
  {
    id: 'game-4',
    homeTeam: 'Michigan Wolverines',
    awayTeam: 'Ohio State Buckeyes',
    league: 'NCAAF',
    schedule: 'Saturday Noon EST',
    lbsScore: 86,
    confidenceTier: 'STRONG',
    badgeColor: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    textColor: 'text-yellow-500',
    marketDescription: 'Match Cover Line',
    openingSpread: 'Ohio St -7.0',
    currentSpread: 'Ohio St -9.5',
    volumeObserved: '$21,550,000',
    sharpDensity: 76,
    averageTickLatency: '14ms',
    syndicatesInvolved: ['Midwest Arbitrage Group', 'Columbus Sharp Syndicate'],
    recentTicks: [
      { time: '10:00', spread: -7.0, volume: 1200000, isSharp: true },
      { time: '12:00', spread: -8.0, volume: 3800000, isSharp: true },
      { time: '14:00', spread: -8.5, volume: 1100000, isSharp: false },
      { time: '16:00', spread: -9.5, volume: 5100000, isSharp: true }
    ],
    priorCoverProbability: 58.0,
    posteriorAdjustment: '+15.2% Multi-Source Shift',
    finalBayesianPosterior: 73.2,
    evidenceWeight: 'HIGH PARITY ALIGNED',
    firewallLatency: '11ms',
    tickIntegrityPass: true,
    sentimentAnomaliesDetected: false,
    consensusVerification: 'VERIFIED'
  },
  {
    id: 'game-5',
    homeTeam: 'Arsenal FC',
    awayTeam: 'Manchester City',
    league: 'SOCCER',
    schedule: 'Wednesday • 3:00 PM EST',
    lbsScore: 94,
    confidenceTier: 'ELITE',
    badgeColor: 'bg-alpha-green/20 text-alpha-green border-alpha-green/30',
    textColor: 'text-alpha-green',
    marketDescription: 'Match Draw Alternative Hedge',
    openingSpread: 'Draw +240',
    currentSpread: 'Draw +215',
    volumeObserved: '$31,800,400',
    sharpDensity: 87,
    averageTickLatency: '22ms',
    syndicatesInvolved: ['London Euro Brokerage', 'Stuttgart Arbitrage Syndicate', 'Asian Liquidity Anchor'],
    recentTicks: [
      { time: '08:00', spread: 2.40, volume: 1800000, isSharp: true },
      { time: '09:30', spread: 2.30, volume: 4200000, isSharp: true },
      { time: '11:00', spread: 2.25, volume: 3100000, isSharp: true },
      { time: '13:00', spread: 2.15, volume: 7800000, isSharp: true }
    ],
    priorCoverProbability: 33.3,
    posteriorAdjustment: '+21.7% Bayesian Entropy Realignment',
    finalBayesianPosterior: 55.0,
    evidenceWeight: 'CRITICAL SHARP CLUSTERING',
    firewallLatency: '18ms',
    tickIntegrityPass: true,
    sentimentAnomaliesDetected: false,
    consensusVerification: 'VERIFIED'
  }
];

export const Landing = () => {
  // Navigation Tabs for the unified, complex landing system
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MARKETING' | 'DEMO' | 'VALUATION'>('OVERVIEW');
  const [selectedDemoGame, setSelectedDemoGame] = useState<GameDemoData>(GAMES_LIST[0]);
  
  // ARR Interactive Scenario Multiplier
  const [arrMultiplier, setArrMultiplier] = useState<number>(1.0);

  // GTM Acquisition Phase Active (for micro interaction)
  const [activeGtmPhase, setActiveGtmPhase] = useState<number>(1);

  // Interactive Calculations based on ARR Multiplier
  const casualSubs = Math.round(800 * arrMultiplier);
  const proSubs = Math.round(400 * arrMultiplier);
  const entSubs = Math.round(20 * arrMultiplier);
  const instSubs = Math.round(1 * arrMultiplier);

  const monthlyCasualRev = casualSubs * 29;
  const monthlyProRev = proSubs * 149;
  const monthlyEntRev = entSubs * 499;
  const monthlyInstRev = instSubs * 1999;

  const totalMonthlyRev = monthlyCasualRev + monthlyProRev + monthlyEntRev + monthlyInstRev;
  const totalARR = totalMonthlyRev * 12;

  // Render ARR Area Chart Data based on current selected multiplier rolling over 6 and 12 months
  const monthlyGrowthData = Array.from({ length: 12 }, (_, monthIndex) => {
    const month = monthIndex + 1;
    // S-curve growth simulation to ARR target
    const monthFactor = Math.sin((month / 12) * Math.PI / 2);
    const mCasual = Math.round(casualSubs * monthFactor);
    const mPro = Math.round(proSubs * monthFactor);
    const mEnt = Math.round(entSubs * monthFactor);
    const mInst = Math.round(instSubs * monthFactor);

    const mMonthlyTotal = (mCasual * 29) + (mPro * 149) + (mEnt * 499) + (mInst * 1999);
    
    return {
      name: `Mo ${month}`,
      'Casual (Retail)': parseFloat((mCasual * 29 * 12 / 1000).toFixed(1)),
      'Pro (Handicapper)': parseFloat((mPro * 149 * 12 / 1000).toFixed(1)),
      'Enterprise (Syndicate)': parseFloat((mEnt * 499 * 12 / 1000).toFixed(1)),
      'Institutional (Whale)': parseFloat((mInst * 1999 * 12 / 1000).toFixed(1)),
      'Cumulative ARR (k$)': parseFloat((mMonthlyTotal * 12 / 1000).toFixed(1)),
    };
  });

  return (
    <div className="flex flex-col gap-12 pb-24 text-white" id="landing-master-root">
      
      {/* Brand Title Block */}
      <div className="flex flex-col gap-2 relative z-10" id="landing-brand-header">
         <div className="flex items-center gap-3">
            <span id="brand-tag-beta" className="px-2.5 py-0.5 bg-alpha-green/10 text-alpha-green text-[9px] font-black uppercase tracking-widest border border-alpha-green/20 rounded">
               Continuous Ingestion Engine v4.2
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
               <span className="w-1.5 h-1.5 bg-alpha-green rounded-full animate-ping" />
               SYSTEM NOMINAL
            </div>
         </div>
         <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white mt-2">
           LINE BREAKER<span className="text-alpha-green lowercase font-sans not-italic font-medium text-lg ml-1">™</span> Workspace
         </h1>
      </div>

      {/* Primary Interaction Tabs */}
      <div className="flex border-b border-white/5 pb-0.5 gap-2 overflow-x-auto" id="landing-tabs-bar">
        {[
          { id: 'OVERVIEW' as const, label: 'Observer Overview', icon: LayoutDashboard },
          { id: 'MARKETING' as const, label: 'Go-To-Market Plan', icon: Trophy },
          { id: 'DEMO' as const, label: 'Live Analytical Engine Demo', icon: Activity },
          { id: 'VALUATION' as const, label: 'Business Valuation Model', icon: BarChart3 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-button-${tab.id.toLowerCase()}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-4 border-b-2 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${
                isActive 
                  ? 'border-alpha-green text-alpha-green bg-alpha-green/5' 
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-alpha-green' : 'text-slate-500'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Switcher Body */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          id="tab-content-container"
        >
          
          {/* ==================== TAB 1 ANSWER: OVERVIEW ==================== */}
          {activeTab === 'OVERVIEW' && (
            <div className="flex flex-col gap-12" id="overview-tab-root">
              
              {/* Stat Bar */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" id="overview-stat-bar">
                {[
                  { id: 'stat-total-vol', label: 'Telemetry Ingested Volume', val: '$421.8M', desc: 'Real-time multi-sport total', color: 'text-white' },
                  { id: 'stat-active-mode', label: 'Active Calibration System', val: 'CAS_NODE_v4.2', desc: 'Bayesian consensus stream', color: 'text-alpha-green font-mono' },
                  { id: 'stat-clv-rate', label: 'Historical CLV-Beat Rate', val: '81.4%', desc: 'Tested over 12,500 markets', color: 'text-white' },
                  { id: 'stat-oracle-latency', label: 'Oracle Ingestion Latency', val: '< 18ms', desc: 'Secure decentralized latency', color: 'text-yellow-500' }
                ].map((st, i) => (
                  <div key={i} id={st.id} className="bento-card p-6 bg-dark-surface border border-white/5 rounded-3xl flex flex-col justify-between">
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest font-sans">{st.label}</p>
                      <p className={`text-2xl font-black italic uppercase tracking-tighter mt-2 ${st.color}`}>{st.val}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 italic mt-3 border-t border-white/5 pt-2">{st.desc}</p>
                  </div>
                ))}
              </div>

              {/* Main Brand Hero with Dual CTA Column */}
              <div className="grid grid-cols-12 gap-8 items-center" id="overview-hero-grid">
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                  <span id="hero-badge-positioning" className="self-start px-3 py-1 bg-alpha-green/10 text-alpha-green border border-alpha-green/25 rounded-xl text-[10px] font-black uppercase tracking-widest">
                     The Bloomberg Terminal for Sports Betting
                  </span>
                  <h2 className="text-5xl lg:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                    Breaking the Spread <br />
                    <span className="text-alpha-green">Before the Market</span> <br />
                    Can Standardize.
                  </h2>
                  <p className="text-lg text-slate-400 font-medium italic mt-2 leading-relaxed">
                    By modeling sports betting as high-frequency risk distribution exchanges, Line Breaker™ tracks sharp money syndicates and computes absolute expected value divergence using real-time priors calibration.
                  </p>
                  
                  {/* DUAL CTA POINTING TO OTHER TAB STATES */}
                  <div className="flex flex-wrap gap-4 mt-6" id="hero-dual-cta">
                    <button
                      id="hero-cta-demo"
                      onClick={() => setActiveTab('DEMO')}
                      className="px-8 py-4.5 bg-alpha-green text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.03] transition-all shadow-[0_0_25px_rgba(0,255,65,0.2)] flex items-center gap-2 group"
                    >
                      <Play size={12} fill="black" className="group-hover:translate-x-0.5 transition-transform" />
                      Initialize Live Engine Demo
                    </button>
                    <button
                      id="hero-cta-valuation"
                      onClick={() => setActiveTab('VALUATION')}
                      className="px-8 py-4.5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 hover:border-white/25 transition-all flex items-center gap-2"
                    >
                      <BarChart3 size={12} className="text-yellow-500" />
                      Inspect Valuation Model
                    </button>
                  </div>
                </div>

                {/* Aesthetic Radial Clock Widget */}
                <div className="col-span-12 lg:col-span-5 relative" id="overview-radial-card">
                  <div className="bento-card p-10 bg-black/60 border border-alpha-green/10 relative overflow-hidden group rounded-[3rem]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-alpha-green/5 to-transparent opacity-50" />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-44 h-44 relative mb-6">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                          <motion.circle
                            cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="502"
                            initial={{ strokeDashoffset: 502 }}
                            animate={{ strokeDashoffset: 502 - (502 * 0.94) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="text-alpha-green"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-black text-white italic">94</span>
                          <span className="text-[9px] text-alpha-green font-black uppercase tracking-widest mt-1">LBS™ SCORE</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="px-3 py-1 bg-alpha-green/15 text-alpha-green text-[10px] font-black uppercase rounded-lg">
                          Elite Arbitrage Covariance
                        </span>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-3">SOCCER: MCI @ ARS • MATCH DRAW HEDGE</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LBS Score Classifications Table */}
              <div className="bento-card p-0 overflow-hidden border border-white/5 rounded-[2.5rem]" id="overview-classification-table">
                <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center bg-white/[0.005]">
                  <div>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">LBS™ Score Classification Tiers</h3>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">The benchmark scale for institutional-grade sports risk assessment</p>
                  </div>
                  <Target className="text-alpha-green opacity-2 w-8 h-8" />
                </div>
                <div className="flex flex-col">
                  {[
                    { range: '90–100', label: 'ELITE', color: 'bg-alpha-green/20 text-alpha-green border-alpha-green/20', desc: 'Enterprise conviction. High-profile syndicate consensus captured. Major divergence from opening probability lines.' },
                    { range: '75–89', label: 'STRONG', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20', desc: 'Accelerated sharp money indicators. Authentic prior shift with comfortable expected value variance.' },
                    { range: '60–74', label: 'POSITIVE', color: 'bg-blue-500/20 text-blue-500 border-blue-500/20', desc: 'Positive drift momentum. Profitable baseline arbitrage space for risk desks. Medium-tier syndicates active.' },
                    { range: '40–59', label: 'NEUTRAL', color: 'bg-slate-500/10 text-slate-400 border-white/5', desc: 'Standard liquid trading zone. Balanced retail and sharp flow. Extreme efficiency bounds fully standardized.' },
                    { range: 'Below 40', label: 'AVOID', color: 'bg-red-500/20 text-red-400 border-red-500/10', desc: 'High retail inflation bias. Adverse movements against standard metrics. Avoid or construct contrarian hedges.' }
                  ].map((row, idx) => (
                    <div key={idx} id={`class-row-${row.label.toLowerCase()}`} className="flex flex-col md:flex-row md:items-center justify-between items-start gap-4 p-5 border-b border-white/5 last:border-b-0 hover:bg-white/[0.01] transition-colors">
                      <div className="flex items-center gap-6">
                        <span className="w-20 font-mono text-slate-500 text-xs font-bold shrink-0">{row.range}</span>
                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded border shrink-0 ${row.color}`}>
                          {row.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 italic font-medium leading-relaxed max-w-4xl">{row.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Three Strategic Engines */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="overview-three-engines">
                {[
                  { id: 'engine-sme', icon: TrendingUp, title: 'SharpMoneyEngine™', desc: 'Decodes high-volume offshore positions and syndicate movement in sub-50ms latency to partition authentic professional money out of public sentiment retail noise.' },
                  { id: 'engine-aiq', icon: Brain, title: 'AthleteIQ™ Telemetry', desc: 'Processes granular biological and psychological parameters including injury recovery, flight logs fatigue, and contract-year incentive formulas.' },
                  { id: 'engine-bcl', icon: Network, title: 'BayesianConfidenceLayer™', desc: 'Executes automated continuous evaluation of prior game postulates. Feeds historical true outcomes back into state matrices to self-correct and prevent model drift.' }
                ].map((eg, i) => {
                  const Icon = eg.icon;
                  return (
                    <div key={i} id={eg.id} className="bento-card p-8 bg-dark-surface border border-white/5 rounded-[2rem] group hover:border-alpha-green/20 transition-all">
                      <div className="w-12 h-12 bg-alpha-green/10 text-alpha-green rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-alpha-green/20">
                        <Icon size={20} />
                      </div>
                      <h4 className="text-lg font-black italic uppercase tracking-tighter text-white mb-2">{eg.title}</h4>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">{eg.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Endorsement Statement / Corporate Mandate */}
              <div className="relative py-20 px-8 lg:px-16 bg-gradient-to-tr from-alpha-green/5 to-white/[0.01] border border-alpha-green/10 rounded-[3rem] overflow-hidden" id="overview- thesis-thesis">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <ShieldCheck size={200} className="text-alpha-green" />
                </div>
                <div className="max-w-4xl relative z-10 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-alpha-green/10 border border-alpha-green/20 rounded text-[10px] font-black text-alpha-green uppercase tracking-widest">
                       Strategic Investment Memo
                    </span>
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest font-mono">T&F Investments & Holdings LLC</span>
                  </div>
                  <blockquote className="text-2xl lg:text-3xl font-black text-white italic leading-tight tracking-tighter">
                    "Line Breaker™ shifts sports forecasting away from standard speculative media advice. It creates a legitimate market observability software apparatus — equipping high-conviction handicappers with Wall Street intelligence standards."
                  </blockquote>
                  <div className="flex flex-col gap-1 mt-4">
                    <p className="text-xs font-black text-alpha-green uppercase tracking-[0.2em] font-sans">Corporate Axiom:</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] font-mono">We Play Clean. We Build Real. We Last Forever.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 2: MARKETING PLAN ==================== */}
          {activeTab === 'MARKETING' && (
            <div className="flex flex-col gap-12" id="marketing-tab-root">
              
              {/* Highlight Findings Box */}
              <div className="p-8 bg-alpha-green/5 border border-alpha-green/20 rounded-[2.5rem] flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center relative overflow-hidden" id="marketing-finding-box">
                <div className="absolute inset-y-0 left-0 w-1 bg-alpha-green" />
                <div className="max-w-4xl">
                  <span className="px-2 py-0.5 bg-alpha-green/15 text-alpha-green text-[9px] font-black uppercase tracking-widest rounded border border-alpha-green/30">
                    Highest conviction target finding
                  </span>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mt-2 flex items-center gap-2">
                     The Pro Tier ($149/mo) Category Category Switch
                  </h3>
                  <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                    Serious handicappers are already spending <strong className="text-white">$200–$500/mo</strong> on premium "locks" websites that provide answers with zero process statistical background. By offering BetPulse LBS™ Pro at <strong className="text-white">$149/mo</strong>, we sell them the <strong className="text-white">analytical machinery and live telemetry, not just advice</strong>. This is a <strong>category switch</strong> (Software/Observability Tool) rather than a simple picks substitute.
                  </p>
                </div>
                <div className="p-4 bg-alpha-green/5 border border-alpha-green/15 rounded-2xl flex flex-col items-center justify-center text-center shrink-0 min-w-[140px]" id="wtp-pro-badge">
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest block">Pro WTP Score</span>
                  <span className="text-4xl font-mono font-black italic text-alpha-green mt-1">9.4/10</span>
                </div>
              </div>

              {/* 5 Audience Segments Grid */}
              <div className="flex flex-col gap-6" id="marketing-audience-section">
                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                  <Users size={18} className="text-alpha-green" /> Targeted Customer Segments Map
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" id="audience-cards-container">
                  {[
                    {
                      id: 'seg-casual',
                      title: 'The Casual Optimizer',
                      price: '$29/mo',
                      wtp: '6.8 / 10',
                      conv: '1.2% rate target',
                      desc: 'Desires a quick visual edge to replace basic media tips. Consumes simplified LBS widgets.',
                      channels: 'SEO, TikTok organic, Reddit'
                    },
                    {
                      id: 'seg-pro',
                      title: 'Serious Handicapper',
                      price: '$149/mo',
                      wtp: '9.4 / 10',
                      conv: '3.5% (High Conviction)',
                      desc: 'Treats sport as mathematical variance engine. Craves underlying sharp volume and priors data.',
                      channels: 'Forums, Podcasts, Elite Affiliates',
                      isHero: true
                    },
                    {
                      id: 'seg-syndicate',
                      title: 'Syndicate Founder',
                      price: '$499/mo',
                      wtp: '8.2 / 10',
                      conv: '0.8% target',
                      desc: 'Manages pooled co-op player banks. Requires API endpoints, csv dumpers, and webhooks alert rules.',
                      channels: 'Niche Discord groups, technical docs'
                    },
                    {
                      id: 'seg-institutional',
                      title: 'Institutional Whale',
                      price: '$1,999/mo',
                      wtp: '7.5 / 10',
                      conv: 'Direct Sales Target',
                      desc: 'Multi-million dollar hedge desks seeking direct, raw model parameters and dedicated servers.',
                      channels: 'B2B enterprise networking, direct outreach'
                    },
                    {
                      id: 'seg-b2b',
                      title: 'API Integration Partner',
                      price: 'Custom Brokerage',
                      wtp: '8.0 / 10',
                      conv: 'Rev-Share / Royalty',
                      desc: 'Sportsbooks and third-party media wanting to display secondary LBS rating scores widgets.',
                      channels: 'Technical Sales, conferences'
                    }
                  ].map((seg, idx) => (
                    <div 
                      key={idx} 
                      id={seg.id}
                      className={`bento-card p-6 rounded-[2rem] flex flex-col justify-between border relative overflow-hidden ${
                        seg.isHero 
                          ? 'bg-gradient-to-b from-alpha-green/[0.03] to-white/[0.02] border-alpha-green/40 shadow-[0_0_20px_rgba(0,255,65,0.05)]' 
                          : 'bg-dark-surface border-white/5'
                      }`}
                    >
                      {seg.isHero && (
                        <span id="hero-badge-marker" className="absolute top-3 right-3 px-1.5 py-0.5 bg-alpha-green text-black rounded text-[8px] font-black uppercase tracking-widest">
                          HERO SEGMENT
                        </span>
                      )}
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-black">{seg.price}</p>
                          <h4 className="text-md font-black italic uppercase tracking-tighter mt-1 leading-tight text-white">{seg.title}</h4>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-[9px] text-slate-500 uppercase">Willingness-to-pay (WTP)</p>
                          <p className="text-sm font-black text-alpha-green font-mono">{seg.wtp}</p>
                        </div>

                        <p className="text-xs text-slate-405 leading-relaxed font-sans">{seg.desc}</p>
                      </div>

                      <div className="pt-4 border-t border-white/5 mt-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-slate-500 uppercase font-bold">Conv Notes:</span>
                          <span className="text-[9px] font-bold text-white uppercase tracking-wider">{seg.conv}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-slate-500 uppercase font-bold">Channels:</span>
                          <span className="text-[9px] text-slate-400 font-mono truncate max-w-[120px]" title={seg.channels}>{seg.channels}</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* 3-Phase Interactive Launch Plan */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="marketing-launch-plan">
                
                {/* Left timeline menu selector */}
                <div className="lg:col-span-4 p-8 bg-dark-surface border border-white/5 rounded-[2.5rem] flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[8px] font-black uppercase tracking-widest rounded border border-yellow-500/20">
                      30-Day Launch Sequence
                    </span>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">
                      Launch Execution Strategy
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Select a launch phase below to analyze the tactical calendar actions, conversion engines, and alignment matrices.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 mt-6">
                    {[
                      { num: 1, label: 'Content Seeding {" & "} Value Splicing', range: 'Day 1 - 10' },
                      { num: 2, label: 'Affiliate Activation {" & "} Pro Codes', range: 'Day 11 - 20' },
                      { num: 3, label: 'Fully Tuned Revenue Engine', range: 'Day 21 - 30' }
                    ].map((phase) => (
                      <button
                        key={phase.num}
                        id={`gtm-phase-btn-${phase.num}`}
                        onClick={() => setActiveGtmPhase(phase.num)}
                        className={`w-full p-4 rounded-2xl flex items-center justify-between border cursor-pointer text-left transition-all ${
                          activeGtmPhase === phase.num 
                            ? 'bg-alpha-green/10 border-alpha-green/30 text-white' 
                            : 'bg-black/20 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-black/40'
                        }`}
                      >
                        <div>
                          <p className={`text-[8px] font-black uppercase tracking-widest ${activeGtmPhase === phase.num ? 'text-alpha-green' : 'text-slate-600'}`}>Phase {phase.num} • {phase.range}</p>
                          <p className="text-xs font-bold leading-tight mt-1">{phase.label}</p>
                        </div>
                        <ArrowUpRight size={16} className={activeGtmPhase === phase.num ? 'text-alpha-green' : 'text-slate-600'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right timeline details panels */}
                <div className="lg:col-span-8 p-8 bg-black/40 border border-white/5 rounded-[2.5rem] flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeGtmPhase}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                      id={`gtm-details-panel-${activeGtmPhase}`}
                    >
                      {activeGtmPhase === 1 && (
                        <>
                          <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <div>
                              <p className="text-[10px] text-alpha-green font-mono uppercase font-black">Day 1 to Day 10 Action Map</p>
                              <h4 className="text-lg font-black italic uppercase text-white mt-1">Value Splicing {" & "} Proof of Capability</h4>
                            </div>
                            <span className="px-3 py-1 bg-alpha-green/10 text-alpha-green text-[9px] font-black uppercase tracking-widest rounded">
                              TACTICAL BACKTESTING
                            </span>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-3">
                              <span className="w-6 h-6 bg-alpha-green/20 text-alpha-green font-mono font-bold text-xs rounded-full flex items-center justify-center shrink-0">1</span>
                              <div>
                                <h5 className="text-xs font-bold uppercase tracking-wider text-white">Public Backtest Distribution</h5>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                                  Release high-fidelity win records detailing real closing line value (CLV) beats across massive sports forums (Reddit /r/sportsbook, specialized Telegram groups). Create structured case studies on how previous models avoided typical "public traps" during critical matches.
                                </p>
                              </div>
                            </div>
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-3">
                              <span className="w-6 h-6 bg-alpha-green/20 text-alpha-green font-mono font-bold text-xs rounded-full flex items-center justify-center shrink-0">2</span>
                              <div>
                                <h5 className="text-xs font-bold uppercase tracking-wider text-white">Interactive Social Bots Deploy</h5>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                                  Spin up lightweight automated X (Twitter) API bots that automatically tweet line movement anomalies and post-game CLV results immediately. Code name indexing to map exact priors and posteriors calculated by our Bayesian engines.
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeGtmPhase === 2 && (
                        <>
                          <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <div>
                              <p className="text-[10px] text-yellow-500 font-mono uppercase font-black">Day 11 to Day 20 Action Map</p>
                              <h4 className="text-lg font-black italic uppercase text-white mt-1">Affiliate Syndication {" & "} Code Seeding</h4>
                            </div>
                            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[9px] font-black uppercase tracking-widest rounded">
                              HIGH CONVICTION CONVERSION
                            </span>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-3">
                              <span className="w-6 h-6 bg-yellow-500/20 text-yellow-500 font-mono font-bold text-xs rounded-full flex items-center justify-center shrink-0 font-sans">1</span>
                              <div>
                                <h5 className="text-xs font-bold uppercase tracking-wider text-white">Podcasters and Advise Core Onboarding</h5>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                                  Establish licensing arrangements with notable high-integrity handicapper hosts and podcasters. Provide free real-time access to their personal premium accounts in exchange for organic demonstration on screens.
                                </p>
                              </div>
                            </div>
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-3">
                              <span className="w-6 h-6 bg-yellow-500/20 text-yellow-500 font-mono font-bold text-xs rounded-full flex items-center justify-center shrink-0 font-sans">2</span>
                              <div>
                                <h5 className="text-xs font-bold uppercase tracking-wider text-white">Exclusive Discord Webhooks</h5>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                                  Seed automated alert webhooks into prominent invite-only Discord servers. Provide early elite signals with high-contrast prior probability overlays to hook professional sports betters.
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeGtmPhase === 3 && (
                        <>
                          <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <div>
                              <p className="text-[10px] text-alpha-green font-mono uppercase font-black">Day 21 to Day 30 Action Map</p>
                              <h4 className="text-lg font-black italic uppercase text-white mt-1">Revenue Engine Calibration</h4>
                            </div>
                            <span className="px-3 py-1 bg-alpha-green/10 text-alpha-green text-[9px] font-black uppercase tracking-widest rounded">
                              FULL SCALE ACQUISITION
                            </span>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-3">
                              <span className="w-6 h-6 bg-alpha-green/20 text-alpha-green font-mono font-bold text-xs rounded-full flex items-center justify-center shrink-0">1</span>
                              <div>
                                <h5 className="text-xs font-bold uppercase tracking-wider text-white">Niche Ad Placement on Under-observed Fields</h5>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                                  Deploy direct paid advertising (Google Ads, Meta, Twitter) focusing specifically on "under-observed" micro props. Capture maximum conversions since retail books generally have less efficient models on niche markets.
                                </p>
                              </div>
                            </div>
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-3">
                              <span className="w-6 h-6 bg-alpha-green/20 text-alpha-green font-mono font-bold text-xs rounded-full flex items-center justify-center shrink-0">2</span>
                              <div>
                                <h5 className="text-xs font-bold uppercase tracking-wider text-white">Segment Real-time Retraining Promo</h5>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                                  Incorporate automated screen summaries when model drift correction resets live (as seen on our developer console). Push proof of continuous self-correction to emphasize technical superiority.
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                </AnimatePresence>

                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-slate-500 font-mono text-[9px]" id="gtm-phase-meta">
                  <span>METADATA SECID_04225</span>
                  <span>CAMPAIGN_TYPE: ORGANIC_VIRAL</span>
                </div>
              </div>
            </div>

            {/* Channel Priorities Priority matrix & ROI projections */}
            <div className="bento-card p-0 overflow-hidden border border-white/5 rounded-[2.5rem]" id="marketing-priority-matrix">
              <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                <h4 className="text-sm font-black text-white italic uppercase tracking-widest">Growth Channel Priority Matrix</h4>
                <p className="text-[9.5px] text-slate-500 uppercase tracking-wide mt-1">Evaluation of acquisition channels and modeled return on investment ratios</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500 text-[10px] font-black uppercase bg-white/[0.005]">
                      <th className="p-5">Growth Channel</th>
                      <th className="p-5">Strategic Priority</th>
                      <th className="p-5">Model CAC Estimation</th>
                      <th className="p-5">Target ROI Yield Ratio</th>
                      <th className="p-5">Primary Metric Checked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { ch: 'Elite Handicapper Affiliates', pr: 'CRITICAL', cac: '$45.00', roi: '6.2x', m: 'Promo Code Ingress Share', pColor: 'text-red-500 bg-red-500/10 border-red-500/20' },
                      { ch: 'Sports Podcast Integrations', pr: 'HIGH', cac: '$32.00', roi: '4.8x', m: 'Click-Through Acquisition Ratio', pColor: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' },
                      { ch: 'Twitter / X Ingestion Bots', pr: 'HIGH', cac: '$4.00', roi: '12.0x', m: 'Direct Profile Links Conversions', pColor: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' },
                      { ch: 'Technical SEO & Sports Wiki', pr: 'MEDIUM', cac: '$15.00', roi: '5.5x', m: 'Monthly Unique Organic Visits', pColor: 'text-blue-400 bg-blue-500/10 border-blue-500/25' },
                      { ch: 'Direct Community Word-of-Mouth', pr: 'CRITICAL', cac: '$8.00', roi: '8.5x', m: 'Two-Way User Referral Codes', pColor: 'text-red-500 bg-red-500/10 border-red-500/20' }
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                        <td className="p-5 font-sans font-black text-white text-sm italic">{row.ch}</td>
                        <td className="p-5">
                          <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${row.pColor}`}>
                            {row.pr}
                          </span>
                        </td>
                        <td className="p-5 font-bold text-white font-mono">{row.cac}</td>
                        <td className="p-5 font-bold text-alpha-green font-mono text-sm">{row.roi}</td>
                        <td className="p-5 text-slate-400 font-sans">{row.m}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
          )}

          {/* ==================== TAB 3: LIVE DEMO ==================== */}
          {activeTab === 'DEMO' && (
            <div className="flex flex-col gap-8" id="demo-tab-root">
              
              {/* Instructions banner */}
              <div className="p-6 bg-dark-surface border border-white/5 rounded-[2.5rem] flex items-center justify-between gap-4" id="demo-guide-banner">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-alpha-green/10 text-alpha-green rounded-xl flex items-center justify-center font-black">
                     <Zap size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white italic uppercase tracking-widest leading-none">Interactive Sandbox Live Simulation</h3>
                    <p className="text-[10px] text-slate-450 mt-1 leading-relaxed font-sans font-medium">Click on any high-profile game to simulate raw parameters processing matching our continuous server architecture.</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-slate-500 text-[10px]">
                  <span className="w-2 h-2 bg-alpha-green rounded-full animate-pulse" />
                  <span className="font-mono tracking-widest font-black uppercase">Ingestion Stream Active</span>
                </div>
              </div>

              {/* Master Split Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="demo-sandbox-grid">
                
                {/* Left Column: Selectable Games */}
                <div className="lg:col-span-5 flex flex-col gap-4" id="demo-left-games-list">
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest font-sans ml-1">Pre-Loaded Sports Telemetry Slots</p>
                  {GAMES_LIST.map((game) => {
                    const isSelected = selectedDemoGame.id === game.id;
                    return (
                      <button
                        key={game.id}
                        id={`demo-game-card-${game.id}`}
                        onClick={() => setSelectedDemoGame(game)}
                        className={`w-full p-6 rounded-[2rem] border text-left transition-all relative overflow-hidden flex items-center justify-between group cursor-pointer ${
                          isSelected 
                            ? 'bg-gradient-to-r from-alpha-green/[0.04] to-transparent border-alpha-green/45 shadow-[0_0_20px_rgba(0,255,65,0.04)] text-white' 
                            : 'bg-dark-surface border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-alpha-green" />
                        )}
                        <div className="space-y-3 max-w-[70%]">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-black/40 border border-white/5 text-[8px] font-black rounded-lg font-sans text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">
                              {game.league}
                            </span>
                            <span className="text-[9px] text-slate-500 font-medium font-sans">{game.schedule}</span>
                          </div>
                          
                          <h4 className="text-md font-black italic uppercase tracking-tighter text-white leading-tight">
                            {game.awayTeam} <span className="text-xs text-slate-500 font-sans not-italic font-medium">at</span> {game.homeTeam}
                          </h4>
                          
                          <p className="text-[9px] text-slate-505 font-sans leading-none truncate">{game.marketDescription}</p>
                        </div>

                        {/* Radial LBS badge score */}
                        <div className="text-right shrink-0">
                          <span className={`px-2 py-1 border text-[9px] font-black uppercase tracking-widest rounded-lg font-mono inline-block mb-1 ${game.badgeColor}`}>
                            LBS™ {game.lbsScore}
                          </span>
                          <p className="text-[7.5px] text-slate-500 uppercase tracking-widest leading-none font-bold mt-1 block">{game.confidenceTier}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right Column: Detailed Telemetry Panel */}
                <div className="lg:col-span-7 p-8 bg-dark-surface border border-white/15 rounded-[3.5rem] flex flex-col justify-between gap-8 h-full min-h-[600px] relative overflow-hidden" id="demo-right-telemetry-panel">
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-alpha-green/10 via-transparent to-transparent" />
                  
                  {/* Selected Match Header */}
                  <div className="flex justify-between items-start border-b border-white/5 pb-5">
                    <div>
                      <span className="px-2 py-0.5 bg-alpha-green/10 text-alpha-green font-mono text-[8px] font-black rounded uppercase">
                        Stream Code: LBS_{selectedDemoGame.id.toUpperCase()}
                      </span>
                      <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter mt-1">
                        {selectedDemoGame.awayTeam} @ {selectedDemoGame.homeTeam}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-sans italic mt-1 leading-none">{selectedDemoGame.league} Market • {selectedDemoGame.schedule}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[8px] text-slate-550 uppercase tracking-widest font-bold">Confidence Tier</p>
                      <span className={`px-3 py-1 font-mono text-[10px] font-black tracking-widest uppercase rounded border inline-block mt-1 ${selectedDemoGame.badgeColor}`}>
                        {selectedDemoGame.confidenceTier}
                      </span>
                    </div>
                  </div>

                  {/* High Quality Ingestion Matrices */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    
                    {/* SharpMoneyEngine™ Module block */}
                    <div id="demo-submodule-sme" className="p-6 bg-black/40 border border-white/5 rounded-3xl flex flex-col justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
                          <TrendingUp size={14} className="text-alpha-green animate-pulse" /> SharpMoneyEngine™
                        </h4>
                        <p className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Sub-50ms offshore syndicate monitor</p>
                      </div>

                      <div className="space-y-2 font-mono text-xs my-1">
                        <div className="flex justify-between border-b border-white/5 pb-1 text-slate-400">
                          <span>Opening Line:</span>
                          <span className="text-white font-bold">{selectedDemoGame.openingSpread}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1 text-slate-400">
                          <span>Current Line:</span>
                          <span className="text-alpha-green font-bold">{selectedDemoGame.currentSpread}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1 text-slate-400">
                          <span>Total Volume:</span>
                          <span className="text-white">{selectedDemoGame.volumeObserved}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1 text-slate-400">
                          <span>Sharp Density:</span>
                          <span className="text-alpha-green font-bold">{selectedDemoGame.sharpDensity}%</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Avg Tick Latency:</span>
                          <span className="text-yellow-500 text-[10px]">{selectedDemoGame.averageTickLatency}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        <p className="text-[7.5px] text-slate-500 uppercase font-bold tracking-widest">Active Syndicates Detected:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedDemoGame.syndicatesInvolved.map((syn, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[7.5px] font-mono font-medium text-slate-300">
                              {syn}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* BayesianConfidenceLayer™ Module block */}
                    <div id="demo-submodule-bcl" className="p-6 bg-black/40 border border-white/5 rounded-3xl flex flex-col justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
                          <Network size={14} className="text-alpha-green" /> BayesianConfidenceLayer™
                        </h4>
                        <p className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">True priors adjusting consensus</p>
                      </div>

                      <div className="space-y-2 font-mono text-xs my-1">
                        <div className="flex justify-between border-b border-white/5 pb-1 text-slate-400">
                          <span>Prior Probability:</span>
                          <span className="text-white font-bold">{selectedDemoGame.priorCoverProbability}%</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1 text-slate-400">
                          <span>Evidence Shift:</span>
                          <span className="text-alpha-green font-bold">{selectedDemoGame.posteriorAdjustment}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Computed Posterior:</span>
                          <span className="text-alpha-green font-bold text-sm tracking-wide">{selectedDemoGame.finalBayesianPosterior}%</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 bg-white/[0.01] p-3 rounded-xl border border-white/5">
                        <p className="text-[8px] text-slate-550 uppercase font-black tracking-widest leading-none block">Evidence Consensus Weight</p>
                        <span className="text-[10px] font-bold text-white mt-1.5 inline-block tracking-wider font-mono">
                          {selectedDemoGame.evidenceWeight}
                        </span>
                        <p className="text-[7.5px] text-slate-500 italic mt-1 font-sans">Based on multi-node consensus alignment</p>
                      </div>
                    </div>

                  </div>

                  {/* Simulator Transaction Ticks Logs & Truth Firewall Checkpoints */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Simulated Ticks Feed Column */}
                    <div id="demo-submodule-ticks" className="md:col-span-7 bg-white/[0.012] border border-white/5 p-5 rounded-2xl flex flex-col gap-3">
                      <p className="text-[8.5px] text-slate-500 uppercase font-bold tracking-widest font-mono">Transaction Ticks Ledger</p>
                      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {selectedDemoGame.recentTicks.map((tick, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1.5 last:border-b-0">
                            <span className="text-slate-500">{tick.time} UTC</span>
                            <div className="text-slate-300">
                              Spread: <strong className="text-white font-sans">{tick.spread > 0 ? `+${tick.spread}` : tick.spread}</strong>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">${(tick.volume/1000).toFixed(0)}k</span>
                              {tick.isSharp ? (
                                <span className="px-1 py-0.2 bg-alpha-green/10 text-alpha-green border border-alpha-green/30 rounded text-[7px] font-black uppercase font-sans">SHARP</span>
                              ) : (
                                <span className="px-1 py-0.2 bg-blue-500/10 text-blue-450 border border-blue-500/15 rounded text-[7px] font-black uppercase font-sans">RETAIL</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Truth Firewall Checklist Status Column */}
                    <div id="demo-submodule-firewall" className="md:col-span-5 bg-white/[0.012] border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="text-[8.5px] text-slate-500 uppercase font-black font-sans">Truth Firewall</p>
                          <span className="w-1.5 h-1.5 bg-alpha-green rounded-full animate-pulse" />
                        </div>

                        <div className="space-y-2 text-[10px] font-mono">
                          <div className="flex items-center gap-2">
                            <CheckCircle size={10} className="text-alpha-green" />
                            <span className="text-slate-300">Tick Integrity Pass</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle size={10} className="text-alpha-green" />
                            <span className="text-slate-300">Sentiment Outlier Verified</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle size={10} className="text-alpha-green" />
                            <span className="text-slate-300">Decentral Consensus</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 mt-3 flex justify-between items-center text-[9px]">
                        <span className="text-slate-550 uppercase">Latency Verification</span>
                        <strong className="text-alpha-green font-mono">{selectedDemoGame.firewallLatency}</strong>
                      </div>
                    </div>

                  </div>

                  {/* Gigantic Scoreboard Dashboard display */}
                  <div className="bg-black/40 border border-alpha-green/20 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-4" id="demo-scoreboard-display">
                    <div className="space-y-1 text-center md:text-left">
                      <span className="px-2 py-0.5 bg-alpha-green/10 text-alpha-green text-[8px] font-black tracking-widest rounded border border-alpha-green/25 font-mono uppercase">
                        Engine Consolidated Output
                      </span>
                      <h4 className="text-lg font-black italic uppercase text-white tracking-tight mt-1">Computed Line Breaker Score™ (LBS™)</h4>
                      <p className="text-[9px] text-slate-500 max-w-sm">Evaluates historical consensus, tick anomaly index, and biological variables against current odd spreads.</p>
                    </div>

                    <div className="flex items-center gap-5 shrink-0" id="glowing-digital-score-capsule">
                      <div className="w-24 h-24 bg-black border-2 border-alpha-green shadow-[0_0_20px_rgba(0,255,65,0.15)] rounded-2xl flex flex-col items-center justify-center relative">
                        <span className="text-5xl font-mono font-black italic mt-1 text-white leading-none">
                          {selectedDemoGame.lbsScore}
                        </span>
                        <span className="text-[7.5px] text-slate-400 uppercase font-bold tracking-widest mt-1">LBS™ RATIO</span>
                      </div>
                      <div className="space-y-1 shrink-0">
                        <span className="text-[8px] text-slate-550 uppercase tracking-widest block font-bold leading-none">Classification:</span>
                        <span className={`text-lg font-black italic uppercase font-mono tracking-widest block ${selectedDemoGame.textColor}`}>
                          {selectedDemoGame.confidenceTier}
                        </span>
                        <p className="text-[8px] text-slate-500 font-bold leading-relaxed font-sans max-w-[120px] italic">Opportunity edge optimized.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 4: BUSINESS VALUATION ==================== */}
          {activeTab === 'VALUATION' && (
            <div className="flex flex-col gap-12" id="valuation-tab-root">
              
              {/* Value proposition check block */}
              <div className="p-8 bg-white/[0.015] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6" id="valuation-premium-callout">
                <div className="max-w-4xl">
                  <span className="px-2.5 py-0.5 bg-alpha-green/10 text-alpha-green text-[9px] font-black uppercase rounded tracking-widest">Pricing Strategy Paradigm</span>
                  <p className="text-xl font-black text-white italic uppercase tracking-tighter mt-2 mt-2 leading-snug">
                     A Software Observability Terminal, Not an Advice Platform.
                  </p>
                  <p className="text-xs text-slate-400 font-sans mt-2 leading-relaxed">
                     BetPulse targets the massive class of sports handicappers who already invest hundreds of dollars dynamically for raw static outputs. By positioning as a transparent analytical workstation, the software establishes an ironclad category switch that holds strong customer willingness-to-pay margins.
                  </p>
                </div>
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-center shrink-0 min-w-[160px]" id="valuation-arr-banner">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Conservative ARR Target</span>
                  <span className="text-3xl font-mono font-black italic mt-1 block text-white">$1.13M</span>
                  <span className="text-[8.5px] text-alpha-green font-bold uppercase tracking-wider block mt-0.5">Year 1 Inbound</span>
                </div>
              </div>

              {/* 4-Tier Pricing Cards with Willingness To Pay scores */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 hover:cursor-default" id="valuation-pricing-map">
                {[
                  {
                    id: 'pricing-basic',
                    title: 'Casual Optimizer',
                    sub: 'Retail Enthusiast',
                    price: '$29/mo',
                    wtp: '6.8 / 10',
                    features: ['Base LBS™ Feed Widgets', 'Standard Ingestion (5-min delay)', 'Clean Prior Probability Score', 'Static Discord summary logs'],
                    bg: 'bg-dark-surface border-white/5 text-slate-400'
                  },
                  {
                    id: 'pricing-pro',
                    title: 'Serious Handicapper',
                    sub: 'High-Conviction Pro',
                    price: '$149/mo',
                    wtp: '9.4 / 10',
                    features: ['Real-Time Latency Ingestion', 'Full SharpMoneyEngine™ Ticks Feed', 'Detailed Bayesian Priors/Posteriors', 'Custom Real-Time Telemetry Alerts', 'Direct Discord Server Alerts Integration'],
                    isHero: true,
                    bg: 'bg-gradient-to-b from-alpha-green/[0.02] to-white/[0.01] border-alpha-green/45 shadow-[0_0_20px_rgba(0,255,65,0.04)] text-slate-300'
                  },
                  {
                    id: 'pricing-enterprise',
                    title: 'Syndicate Founder',
                    sub: 'Advanced Pooling Desk',
                    price: '$499/mo',
                    wtp: '8.2 / 10',
                    features: ['Consolidated REST API access', 'Unlimited Personal Webhooks triggers', 'Export Historical Raw CSV data', 'Priority Calibration node slots', 'Multi-user tenant team keys'],
                    bg: 'bg-dark-surface border-white/5 text-slate-450'
                  },
                  {
                    id: 'pricing-institutional',
                    title: 'Institutional Whale',
                    sub: 'Desk and Large Funds',
                    price: '$1,999/mo',
                    wtp: '7.5 / 10',
                    features: ['Dedicated Virtual Private Servers', 'Custom AthleteIQ™ Calibration', 'Direct Raw RPC feeds', 'Underlying State Vectors', '24/7 Priority Integration Support'],
                    bg: 'bg-dark-surface border-white/5 text-slate-450'
                  }
                ].map((tier, idx) => (
                  <div 
                    key={idx} 
                    id={tier.id}
                    className={`bento-card p-6 flex flex-col justify-between rounded-3xl border relative overflow-hidden ${tier.bg}`}
                  >
                    {tier.isHero && (
                      <span id="pro-badge-glowing" className="absolute top-3 right-3 px-2 py-0.5 bg-alpha-green text-black rounded text-[8px] font-black uppercase tracking-widest">
                        Core Value Hero
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <span className="text-[9px] text-slate-550 uppercase tracking-widest block font-bold font-mono">{tier.sub}</span>
                        <h4 className="text-lg font-black italic uppercase text-white mt-1 leading-snug">{tier.title}</h4>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[8.5px] text-slate-500 uppercase block font-bold">Willingness-to-pay (WTP) Score:</span>
                        <strong className="text-sm font-black text-alpha-green font-mono block">{tier.wtp}</strong>
                      </div>

                      <div className="space-y-2 mt-4">
                        <p className="text-3xl font-mono font-black italic text-white leading-none">{tier.price}</p>
                        <p className="text-[8.5px] text-slate-500 uppercase leading-none font-sans font-bold">Recurring Membership Sub</p>
                      </div>

                      <div className="pt-4 border-t border-white/5 mt-4">
                        <ul className="space-y-2">
                          {tier.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-400">
                              <span className="text-alpha-green shrink-0 mt-0.5">•</span>
                              <span className="leading-tight font-sans font-medium">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-6">
                      <button 
                        id={`pricing-btn-opt-${tier.id}`}
                        className={`w-full py-2.5 rounded-xl uppercase tracking-widest font-black text-[9px] transition-colors ${
                          tier.isHero 
                            ? 'bg-alpha-green hover:bg-alpha-green/90 text-black' 
                            : 'bg-white/5 hover:bg-white/10 text-slate-350'
                        }`}
                      >
                        Model Member conversion
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* 12-Month ARR Model Interactive scenario visualizer */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="arr-simulator-module">
                
                {/* Simulator Inputs & Micro values display */}
                <div className="lg:col-span-5 p-8 bg-dark-surface border border-white/5 rounded-[3rem] flex flex-col justify-between gap-6 relative">
                  <div className="space-y-4">
                    <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/25 text-[8.5px] font-black rounded uppercase">
                       Live Business Planning Scenario
                    </span>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">
                      12-Month Subscriber Growth Simulator
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Adjust the multiplier slider to visualize how our subscription models scale our Year 1 ARR targets from conservative baselines to accelerated growth bounds.
                    </p>
                  </div>

                  {/* Range Slider Container with ID */}
                  <div className="space-y-2 p-5 bg-black/40 rounded-2xl border border-white/5">
                     <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[9.5px]">Scenario Scale Factor</span>
                        <strong className="text-alpha-green font-mono font-black text-sm">{arrMultiplier.toFixed(1)}x Scale</strong>
                     </div>
                     <input 
                       type="range" 
                       id="arr-slider-multiplier"
                       min="0.5" 
                       max="2.5" 
                       step="0.1" 
                       value={arrMultiplier} 
                       onChange={(e) => setArrMultiplier(parseFloat(e.target.value))}
                       className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-alpha-green mt-3 outline-none"
                     />
                     <div className="flex justify-between font-mono text-[8px] text-slate-600 mt-1">
                        <span>0.5x Conservative</span>
                        <span>1.0x Core Base ($1.13M)</span>
                        <span>2.5x Accelerated</span>
                     </div>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs p-5 bg-white/[0.01] border border-white/5 rounded-2xl">
                     <p className="text-[8.5px] text-slate-500 uppercase font-black font-sans border-b border-white/5 pb-1 mb-2">Simulated Subs Count</p>
                     <div className="flex justify-between text-slate-400">
                       <span>Casual Optimizer:</span>
                       <span className="text-white font-bold">{casualSubs} members</span>
                     </div>
                     <div className="flex justify-between text-slate-400">
                       <span>Serious Professional:</span>
                       <span className="text-alpha-green font-bold text-sm tracking-wide">{proSubs} members</span>
                     </div>
                     <div className="flex justify-between text-slate-400">
                       <span>Syndicate Desk:</span>
                       <span className="text-white font-bold">{entSubs} members</span>
                     </div>
                     <div className="flex justify-between text-slate-400">
                       <span>Institutional Whales:</span>
                       <span className="text-white font-bold">{instSubs} desks</span>
                     </div>
                  </div>

                  <div className="p-4 bg-alpha-green/5 border border-alpha-green/15 rounded-2xl text-center flex flex-col justify-center" id="computed-yearly-arr-indicator">
                     <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none block">Year 1 Cumulative ARR</span>
                     <span className="text-4xl font-mono font-black italic mt-1.5 text-alpha-green block">
                       ${(totalARR / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k
                     </span>
                     <p className="text-[8px] text-slate-500 font-sans tracking-wide mt-1 italic">
                       Evaluated over {casualSubs + proSubs + entSubs + instSubs} scaled concurrent active sub targets.
                     </p>
                  </div>
                </div>

                {/* Simulated Stacked Chart Area */}
                <div className="lg:col-span-7 p-8 bg-black/40 border border-white/5 rounded-[3rem] flex flex-col justify-between" id="arr-chart-container">
                  <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                    <div>
                      <h4 className="text-md font-black italic uppercase text-white flex items-center gap-1.5 font-sans">
                         <BarChart size={16} className="text-alpha-green" /> Recurrent Revenue Pipeline Projections
                      </h4>
                      <p className="text-[9px] text-slate-500 uppercase font-mono tracking-widest mt-0.5">Stacked growth path simulation over 12 months (in Thousands of Dollars)</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-alpha-green/10 text-alpha-green text-[8px] font-black uppercase rounded font-mono">
                      DYNAMIC MODEL
                    </span>
                  </div>

                  <div className="w-full h-80 my-4" id="recharts-arr-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthlyGrowthData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorCasual" cx="0%" cy="0%" r="100%">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorPro" cx="0%" cy="0%" r="100%">
                            <stop offset="5%" stopColor="#00ff41" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#00ff41" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorEnt" cx="0%" cy="0%" r="100%">
                            <stop offset="5%" stopColor="#eab308" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorInst" cx="0%" cy="0%" r="100%">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#25252d" />
                        <XAxis dataKey="name" stroke="#5f5f6f" fontSize={10} fontFamily="JetBrains Mono" />
                        <YAxis stroke="#5f5f6f" fontSize={10} fontFamily="JetBrains Mono" unit="k" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#131317', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                          labelStyle={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#5f5f6f', fontWeight: 'bold' }}
                          itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#ffffff' }}
                        />
                        <Area type="monotone" dataKey="Casual (Retail)" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCasual)" />
                        <Area type="monotone" dataKey="Pro (Handicapper)" stackId="1" stroke="#00ff41" fillOpacity={1} fill="url(#colorPro)" />
                        <Area type="monotone" dataKey="Enterprise (Syndicate)" stackId="1" stroke="#eab308" fillOpacity={1} fill="url(#colorEnt)" />
                        <Area type="monotone" dataKey="Institutional (Whale)" stackId="1" stroke="#a855f7" fillOpacity={1} fill="url(#colorInst)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="text-[9px] text-slate-500 italic leading-relaxed text-center font-sans tracking-wide">
                     ARR model features conservative S-curve active acquisition bounds over initial quarters representing optimized monthly retention rates.
                  </p>
                </div>

              </div>

              {/* 4-Part Moat Checklist Bento */}
              <div className="flex flex-col gap-6" id="valuation-moat-blueprint">
                <div>
                  <h3 className="text-lg font-black text-white italic uppercase tracking-tighter flex items-center gap-1.5 font-sans">
                    <ShieldAlert size={18} className="text-alpha-green" /> The Enterprise Core Defensive Moats
                  </h3>
                  <p className="text-[10px] text-slate-550 uppercase tracking-widest font-mono">Structural assets protecting code assets from direct imitation</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6" id="moat-grid-boxes">
                  {[
                    { id: 'moat-tf', icon: ShieldCheck, title: 'Truth Firewall', text: 'Self-defending continuous ingestion layer that isolates anomalous odds providers, erroneous sentiment peaks, or artificial betting volumes to keep the composite scores pristine.' },
                    { id: 'moat-odb', icon: Database, title: 'Outcome Database', text: 'A cumulative history ledger registering high-density win outcomes, serving as an unmatched backtesting baseline that becomes more optimized with every match resolved.' },
                    { id: 'moat-ec', icon: Cpu, title: 'Epistemic Compiler', descIcon: true, titleId: 'Epistemic Compiler Engine', text: 'Proprietary mathematical pipeline that processes prior postulates metrics side-by-side with high-volume sharp movement indicators in microseconds.' },
                    { id: 'moat-at', icon: Layers, title: 'Alpha Terminal Layout', text: 'An elegant, extremely dense interface workspace that matches the high-end operational flow of high-frequency financial traders, building absolute software stickiness.' }
                  ].map((moat, idx) => {
                    const Icon = moat.icon;
                    return (
                      <div key={idx} id={moat.id} className="bento-card p-6 bg-dark-surface border border-white/5 rounded-3xl group hover:border-alpha-green/20 transition-all flex flex-col justify-between">
                        <div>
                          <div className="w-10 h-10 bg-alpha-green/10 text-alpha-green border border-alpha-green/25 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shrink-0">
                            <Icon size={16} />
                          </div>
                          <h4 className="text-md font-black italic uppercase text-white tracking-snug mb-2">{moat.title}</h4>
                        </div>
                        <p className="text-xs text-slate-450 leading-relaxed font-sans">{moat.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Seed Funding Range & Comparable Exits Block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="valuation-seed-exits">
                
                {/* Seed funding details panel */}
                <div className="lg:col-span-6 p-8 bg-dark-surface border border-white/5 rounded-[2.5rem] flex flex-col justify-between gap-6" id="seed-capital-panel">
                  <div className="space-y-4">
                     <span className="px-3 py-1 bg-alpha-green/10 text-alpha-green border border-alpha-green/25 text-[9px] font-black rounded-xl uppercase">
                        Current Investment Proposal
                     </span>
                     <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mt-2 mt-2">
                        $18M – $28M Valuation Range
                     </h3>
                     <p className="text-xs text-slate-400 leading-relaxed font-sans mt-2">
                        Line Breaker™ is raising a <strong className="text-white">$2.5M seed round</strong> to secure additional premium ingestion connections, optimize automated calibration clusters, and scale direct marketing affiliate pipelines targeting the 3.5% conversion Pro handicapper tier.
                     </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                     <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black leading-none block">Target Funding</span>
                        <strong className="text-lg font-mono font-black italic text-white block mt-1">$2.5M</strong>
                     </div>
                     <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black leading-none block">Post Seed Implied</span>
                        <strong className="text-lg font-mono font-black italic text-alpha-green block mt-1">$18M–$28M</strong>
                     </div>
                     <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black leading-none block">Operational Runway</span>
                        <strong className="text-lg font-mono font-black italic text-white block mt-1">24 Months</strong>
                     </div>
                  </div>
                </div>

                {/* Comparable Exits Column */}
                <div className="lg:col-span-6 p-8 bg-black/40 border border-white/5 rounded-[2.5rem] flex flex-col justify-between gap-6" id="comp-exits-panel">
                   <div className="space-y-2">
                      <p className="text-[9px] text-slate-550 uppercase tracking-widest font-mono">Analogous Platform Exit Signatures</p>
                      <h4 className="text-lg font-black italic uppercase text-white tracking-tight">Real-World exit market comparison</h4>
                      <p className="text-xs text-slate-450 font-sans leading-relaxed">
                         Sports intelligence utilities scale rapidly once technical moats are established. Unlike standard advertising systems, BetPulse acts as a direct software utility.
                      </p>
                   </div>

                   <div className="space-y-3 font-mono text-xs">
                      {[
                        { title: 'The Action Network', exit: '$240M Exit Acquisition', detail: 'Content & affiliate media driven model' },
                        { title: 'Sportradar Group AG', exit: '~$3.5B Enterprise Cap', detail: 'Consolidated B2B raw data brokers service' },
                        { title: 'VegasInsider / OddsChecker', exit: '~$120M Consolidated Cap', detail: 'Standardized media portal representation' }
                      ].map((ex, i) => (
                        <div key={i} className="p-3 bg-white/[0.015] border border-white/5 rounded-xl flex justify-between items-center whitespace-normal gap-4">
                           <div>
                              <p className="font-bold text-white text-xs">{ex.title}</p>
                              <p className="text-[9.5px] text-slate-500 mt-0.5 font-sans italic">{ex.detail}</p>
                           </div>
                           <span className="px-2 py-1 bg-alpha-green/10 border border-alpha-green/20 text-alpha-green text-[10px] font-black italic text-right shrink-0">
                              {ex.exit}
                           </span>
                        </div>
                      ))}
                   </div>
                </div>

              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
};
