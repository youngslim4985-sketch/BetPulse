import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Calendar,
  Info,
  Layers,
  ArrowUpRight,
  Database,
  Cpu,
  Brain,
  Search,
  X
} from 'lucide-react';

interface Game {
  id: string;
  sport_key: string;
  status?: string;
  home_score?: number;
  away_score?: number;
  period?: string;
  clock?: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  spread: number;
  line_movement: number;
  public_betting_pct: number;
  sharp_money_indicator: number;
  matchup_rating: number;
  alpha_score: number;
}

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [insights, setInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState<any>(null);
  const [playerProps, setPlayerProps] = useState<any[]>([]);
  const [loadingProps, setLoadingProps] = useState(false);

  const [isGameIQOpen, setIsGameIQOpen] = useState(false);
  const [iqQuery, setIqQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [iqResult, setIqResult] = useState<any>(null);

  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
      value: d.toISOString().split('T')[0]
    };
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Stats fetch failed', err));
  }, []);

  useEffect(() => {
    setLoadingProps(true);
    fetch(`/api/player-props?sport=${selectedSport}`)
      .then(res => res.json())
      .then(data => {
        setPlayerProps(data);
        setLoadingProps(false);
      })
      .catch(err => {
        console.error('Failed to fetch props', err);
        setLoadingProps(false);
      });
  }, [selectedSport]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/games?sport=${selectedSport}`)
      .then(res => res.json())
      .then(data => {
        // Filter by selected date on client side for now
        const filteredByDate = data.filter((g: Game) => g.commence_time.startsWith(selectedDate));
        setGames(filteredByDate);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch games', err);
        setLoading(false);
      });
  }, [selectedSport, selectedDate]);

  const handleAnalyzeGame = (gameId: string) => {
    setIsAnalyzing(true);
    setIqResult(null);
    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId })
    })
      .then(res => res.json())
      .then(data => {
        setIqResult(data.data);
        setIsAnalyzing(false);
      })
      .catch(err => {
        console.error('Analysis failed', err);
        setIsAnalyzing(false);
      });
  };

  const filteredIqSearch = games.filter(g => 
    g.home_team.toLowerCase().includes(iqQuery.toLowerCase()) || 
    g.away_team.toLowerCase().includes(iqQuery.toLowerCase())
  );
  useEffect(() => {
    if (selectedGame) {
      setLoadingInsights(true);
      setInsights('');
      fetch(`/api/insights/${selectedGame.id}`)
        .then(res => res.json())
        .then(data => {
          setInsights(data.insights);
          setLoadingInsights(false);
        })
        .catch(err => {
          console.error('Failed to fetch insights', err);
          setInsights('Error loading insights.');
          setLoadingInsights(false);
        });
    }
  }, [selectedGame]);

  // Find the top conviction game
  const convictionGame = [...games].sort((a, b) => b.alpha_score - a.alpha_score)[0];

  return (
    <div className="min-h-screen bg-dark-bg text-slate-200 font-sans selection:bg-alpha-green selection:text-black p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-alpha-green rounded-lg flex items-center justify-center text-black font-black text-2xl shadow-[0_0_20px_rgba(0,255,65,0.4)]">
            LB
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">
              Line Breaker<span className="text-alpha-green italic lowercase">™</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-alpha-green rounded-full animate-pulse"></span>
              Event-Driven Architecture • Market Logic v4.2 • CID: 0xFB22A
            </p>
          </div>
        </div>
        
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => setIsGameIQOpen(true)}
              className="px-5 py-2 bg-dark-bg border border-alpha-green/30 text-alpha-green text-[11px] font-black rounded-full hover:bg-alpha-green/10 transition-all uppercase tracking-widest flex items-center gap-2"
            >
              <Brain size={14} /> Game IQ™
            </button>
            <div className="px-5 py-2 bg-dark-surface border border-dark-border rounded-full flex items-center gap-3">
             <Layers size={14} className="text-alpha-green" />
             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">FAISS-Backed Dedupe Engine</span>
          </div>
          <button className="px-6 py-2 bg-alpha-green text-black text-xs font-black rounded-lg hover:bg-[#00cc34] transition-all uppercase tracking-widest shadow-xl shadow-alpha-green/10">
            Get Pro Access
          </button>
        </div>
      </header>

      {/* Sport Selector */}
      <div className="max-w-7xl mx-auto mb-4 flex flex-wrap gap-2">
        {['all', 'americanfootball', 'basketball', 'baseball', 'soccer'].map((sport) => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              selectedSport === sport 
                ? 'bg-alpha-green text-black shadow-[0_0_15px_rgba(0,255,65,0.3)]' 
                : 'bg-dark-surface text-slate-500 border border-dark-border hover:text-slate-300'
            }`}
          >
            {sport.replace('americanfootball', 'football')}
          </button>
        ))}
      </div>

      {/* Date Navigation */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <Calendar size={14} className="text-slate-500 shrink-0" />
        <div className="flex gap-2">
          {dateOptions.map((date) => (
            <button
              key={date.value}
              onClick={() => setSelectedDate(date.value)}
              className={`px-4 py-2 rounded-lg text-[10px] whitespace-nowrap font-bold uppercase tracking-widest transition-all border ${
                selectedDate === date.value
                  ? 'bg-white/10 text-white border-alpha-green/50'
                  : 'bg-dark-surface/50 text-slate-500 border-dark-border/50 hover:border-slate-700'
              }`}
            >
              {date.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Bento Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-12 gap-6 auto-rows-max">
        
        {/* Primary Alpha Conviction Card (Left Side) */}
        {!loading && convictionGame && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-12 lg:col-span-5 bento-card min-h-[400px] flex flex-col group cursor-pointer"
            onClick={() => setSelectedGame(convictionGame)}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-alpha-green to-transparent"></div>
            <div className="flex justify-between items-start mb-10">
              <span className="px-3 py-1 bg-alpha-green/10 text-alpha-green text-[10px] font-black rounded border border-alpha-green/20 uppercase tracking-widest">
                Top Edge Pick
              </span>
              <span className="text-xs text-slate-500 font-mono italic">ID: {convictionGame.id}</span>
            </div>

            <div className="flex-grow flex flex-col justify-center text-center">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-3 uppercase italic tracking-tighter leading-none">
                {convictionGame.status === 'live' ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-4 text-4xl md:text-5xl">
                      <span className="text-white">{convictionGame.away_score}</span>
                      <span className="text-alpha-green/30 px-2 border border-alpha-green/20 rounded text-xl">vs</span>
                      <span className="text-white">{convictionGame.home_score}</span>
                    </div>
                    <div className="text-alpha-green text-xs font-mono flex items-center gap-2 tracking-widest">
                       <span className="w-2 h-2 bg-alpha-green rounded-full animate-pulse"></span>
                       {convictionGame.period} • {convictionGame.clock}
                    </div>
                  </div>
                ) : (
                  <>
                    {convictionGame.spread < 0 ? convictionGame.home_team : convictionGame.away_team} <br/>
                    <span className="text-alpha-green">{convictionGame.spread > 0 ? `+${convictionGame.spread}` : convictionGame.spread}</span>
                  </>
                )}
              </h2>
              <p className="text-slate-400 text-sm mb-10 font-medium uppercase tracking-widest">
                {convictionGame.status === 'live' ? `${convictionGame.away_team} @ ${convictionGame.home_team}` : `Market Momentum: ${convictionGame.line_movement > 0 ? 'FAVORING FAV' : 'FAVORING DOG'}`}
              </p>

              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <p className="text-[10px] uppercase text-slate-500 mb-2 font-bold tracking-widest">Edge Score</p>
                  <div className="text-7xl font-black text-alpha-green font-mono tracking-tighter">{convictionGame.alpha_score}</div>
                </div>
                <div className="w-[1px] h-20 bg-dark-border opacity-50"></div>
                <div className="text-left font-mono">
                  <p className="text-[10px] uppercase text-slate-500 mb-2 font-bold tracking-widest">Confidence</p>
                  <p className="text-lg font-black text-white uppercase tracking-tighter">Pro Signal</p>
                  <p className="text-xs text-alpha-green italic">Alpha Confidence: {convictionGame.alpha_score}%</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-dark-border flex justify-between items-center text-[10px] font-mono tracking-widest uppercase">
              <span className="text-slate-500">Analysis: <span className="text-white">Professional</span></span>
              <span className="text-alpha-green underline cursor-pointer hover:text-white transition-colors">Momentum Breakdown</span>
            </div>
          </motion.div>
        )}

        {/* Live Board Grid (Right Side) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-7 bento-card p-0 flex flex-col h-full bg-[#08080a]"
        >
          <div className="p-5 border-b border-dark-border bg-[#0d0d0f] flex justify-between items-center rounded-t-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200 flex items-center gap-2">
              <Activity size={14} className="text-alpha-green" /> The Momentum Board
            </h3>
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              UPDATED: 2S AGO <ArrowUpRight size={10} />
            </span>
          </div>
          <div className="flex-grow overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] text-slate-500 border-b border-dark-border uppercase font-bold tracking-widest">
                  <th className="p-6">Matchup</th>
                  <th className="p-6 text-center">Spread</th>
                  <th className="p-6 text-center">Sharp %</th>
                  <th className="p-6 text-center">Public %</th>
                  <th className="p-6 text-right">Edge™</th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse border-b border-dark-border/30">
                      <td colSpan={5} className="p-6 h-12 bg-white/5"></td>
                    </tr>
                  ))
                ) : (
                  games.map((game) => (
                    <tr 
                      key={game.id} 
                      className={`border-b border-dark-border/30 hover:bg-alpha-green/5 transition-all cursor-pointer group ${game.status === 'live' ? 'bg-alpha-green/[0.02]' : ''}`}
                      onClick={() => setSelectedGame(game)}
                    >
                      <td className="p-6 font-bold group-hover:text-alpha-green transition-colors uppercase italic truncate max-w-[200px]">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-[8px] text-alpha-green/60 font-mono tracking-widest group-hover:text-alpha-green transition-colors">
                            {game.sport_key.split('_')[1] || game.sport_key}
                          </div>
                          {game.status === 'live' && (
                            <div className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-alpha-green rounded-full animate-pulse"></span>
                              <span className="text-[7px] text-alpha-green font-black tracking-tighter uppercase">Live {game.period}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <div className="flex flex-col">
                            <span>{game.away_team}</span>
                            <span>{game.home_team}</span>
                          </div>
                          {game.status === 'live' && (
                            <div className="flex flex-col items-end text-xl font-mono text-alpha-green pr-4">
                              <span>{game.away_score}</span>
                              <span>{game.home_score}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-6 text-center text-slate-400 font-mono text-lg font-black">
                        {game.spread > 0 ? `+${game.spread}` : game.spread}
                      </td>
                      <td className={`p-6 text-center font-mono ${game.sharp_money_indicator > 0.7 ? 'text-alpha-green font-bold' : 'text-slate-500'}`}>
                        {Math.round(game.sharp_money_indicator * 100)}%
                      </td>
                      <td className="p-6 text-center font-mono text-slate-500">
                        {game.public_betting_pct}%
                      </td>
                      <td className="p-6 text-right">
                        <span className={`text-xl font-black font-mono transition-all ${game.alpha_score > 80 ? 'text-alpha-green scale-110 block drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]' : 'text-white'}`}>
                          {game.alpha_score}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Sentiment Gauge Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 md:col-span-6 lg:col-span-4 bento-card"
        >
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Liquidity Polarisation</h3>
          <div className="space-y-10">
            <div>
              <div className="flex justify-between text-[11px] mb-3 font-mono font-bold">
                <span className="uppercase text-slate-400 tracking-widest">Sharp Liquidity</span>
                <span className="text-alpha-green">$1.24M</span>
              </div>
              <div className="w-full h-2.5 bg-dark-bg border border-dark-border rounded-full overflow-hidden">
                <div className="bg-alpha-green h-full w-[82%] shadow-[0_0_10px_#00FF41]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-3 font-mono font-bold">
                <span className="uppercase text-slate-400 tracking-widest">Public Tickets</span>
                <span className="text-red-500">22.8k</span>
              </div>
              <div className="w-full h-2.5 bg-dark-bg border border-dark-border rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[94%]"></div>
              </div>
            </div>
            <div className="pt-6 border-t border-dark-border text-center">
              <p className="text-[10px] text-slate-500 uppercase mb-2 tracking-widest font-bold">Market Signal</p>
              <p className="text-3xl font-black uppercase text-white italic tracking-tighter">Extreme Alpha</p>
            </div>
          </div>
        </motion.div>

        {/* Player Prop Edge Card (Replaces Alert Log) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-12 md:col-span-6 lg:col-span-4 bento-card flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Best Player Bets</h3>
              <p className="text-[7px] text-slate-600 uppercase font-mono tracking-widest mt-0.5">Deduplicated Prop Feed • FAISS v1.2</p>
            </div>
            <span className="px-2 py-0.5 bg-alpha-green/10 text-alpha-green text-[8px] font-black rounded uppercase">May 2026 Season</span>
          </div>
          <div className="space-y-3 flex-grow overflow-y-auto max-h-[190px] scrollbar-hide">
            {loadingProps ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse"></div>)}
              </div>
            ) : playerProps.map((prop, idx) => (
              <div key={prop.id} className="p-4 bg-dark-bg border border-dark-border rounded-xl group hover:border-alpha-green/40 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="text-[9px] text-alpha-green font-black uppercase tracking-tighter mb-0.5">{prop.player_name}</p>
                    <p className="text-[11px] text-white font-bold leading-none">{prop.prop_type}: {prop.line_value}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-alpha-green font-mono">{prop.edge_score}</span>
                    <p className="text-[7px] text-slate-500 uppercase tracking-widest leading-none mt-1">Edge</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                  <span className="text-[8px] text-slate-500 uppercase font-mono">{prop.team}</span>
                  <span className={`text-[8px] font-black uppercase ${prop.over_odds < 0 ? 'text-white' : 'text-slate-400'}`}>
                    Over {prop.over_odds > 0 ? `+${prop.over_odds}` : prop.over_odds}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack Metrics */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-12 lg:col-span-4 bento-card bg-alpha-green/5 border-alpha-green/20"
        >
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-alpha-green mb-6 flex items-center gap-2">
            <Cpu size={14} /> System Health
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-dark-bg rounded-xl border border-dark-border">
              <TrendingUp size={16} className="text-alpha-green mb-2" />
              <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">75+ Win Rate</p>
              <p className="text-xl font-mono text-alpha-green font-black tracking-tighter">
                {stats?.highConfidence?.win_percentage || '61.4'}%
              </p>
            </div>
            <div className="p-4 bg-dark-bg rounded-xl border border-dark-border">
              <Users size={16} className="text-slate-500 mb-2" />
              <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Sample Size</p>
              <p className="text-xl font-mono text-white font-black tracking-tighter">
                {stats?.highConfidence?.total_picks || '142'} Units
              </p>
            </div>
          </div>
        </motion.div>

        {/* Global Stats Footer */}
        <div className="col-span-12 bento-card p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#121214]">
           <div className="flex gap-8 items-center flex-wrap justify-center">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Overall Success</span>
                <span className="text-xs font-mono text-white">{stats?.overall?.win_percentage || '54.2'}% Accuracy</span>
              </div>
              <div className="w-[1px] h-6 bg-dark-border hidden md:block"></div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Season Record</span>
                <span className="text-xs font-mono text-white">
                  {stats?.overall?.wins || '624'}W - {stats?.overall?.losses || '540'}L
                </span>
              </div>
              <div className="w-[1px] h-6 bg-dark-border hidden md:block"></div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Engine Load</span>
                <span className="text-xs font-mono text-white">Nominal (12%)</span>
              </div>
           </div>
           <div className="flex gap-6 items-center">
              <span className="text-[10px] font-mono text-alpha-green uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-alpha-green rounded-full"></span> Build: Prod_Ready
              </span>
           </div>
        </div>
      </main>

      {/* Selected Game Analytics (Modal) */}
      <AnimatePresence>
        {selectedGame && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGame(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#0c0c0e] border border-dark-border rounded-3xl p-8 max-w-2xl w-full shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1.5 bg-alpha-green"></div>
               <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Deep Intelligence</h2>
                    <div className="flex flex-wrap items-center gap-4">
                      <p className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-mono font-bold flex items-center gap-2">
                        <Zap size={10} className="text-alpha-green" /> {selectedGame.away_team} @ {selectedGame.home_team}
                      </p>
                      {selectedGame.status === 'live' && (
                        <span className="px-2 py-0.5 bg-alpha-green/20 rounded text-alpha-green text-[9px] font-black uppercase tracking-tighter flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-alpha-green rounded-full animate-pulse"></span>
                          Live {selectedGame.period} {selectedGame.clock}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {selectedGame.status === 'live' && (
                      <div className="flex items-center gap-4 font-mono text-2xl font-black italic">
                         <span className="text-white">{selectedGame.away_score}</span>
                         <span className="text-slate-700">/</span>
                         <span className="text-white">{selectedGame.home_score}</span>
                      </div>
                    )}
                    <button onClick={() => setSelectedGame(null)} className="text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg shrink-0">
                      <Zap size={20} className="rotate-90" />
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-6">
                    <div className="bg-black/60 p-6 rounded-2xl border border-dark-border">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] uppercase text-slate-500 font-black tracking-[0.2em]">Momentum Edge Score</span>
                        <span className="text-alpha-green font-mono font-black text-3xl">{selectedGame.alpha_score}</span>
                      </div>
                      <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedGame.alpha_score}%` }}
                          className="h-full bg-alpha-green shadow-[0_0_15px_rgba(0,255,65,0.8)]"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-black/40 p-5 rounded-xl border border-dark-border flex items-start gap-4">
                      <div className="w-10 h-10 bg-alpha-green/10 rounded-lg flex items-center justify-center text-alpha-green shrink-0 mt-1">
                         <Activity size={20} />
                      </div>
                      <div className="flex-1">
                        <h6 className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 italic">AI Analytical Verdict</h6>
                        <div className="text-[13px] text-slate-300 leading-tight font-medium font-mono min-h-[60px]">
                          {loadingInsights ? (
                             <div className="flex items-center gap-2 animate-pulse">
                                <span className="w-1 h-3 bg-alpha-green rounded-full"></span>
                                <span className="w-1 h-3 bg-alpha-green rounded-full"></span>
                                <span className="w-1 h-3 bg-alpha-green rounded-full"></span>
                             </div>
                          ) : insights}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 font-mono">
                    <div className="p-4 bg-dark-bg rounded-xl flex justify-between items-center border border-dark-border group hover:border-alpha-green/30 transition-colors">
                       <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Public Sentiment</span>
                       <span className="text-slate-200 font-black">{selectedGame.public_betting_pct}%</span>
                    </div>
                    <div className="p-4 bg-dark-bg rounded-xl flex justify-between items-center border border-dark-border group hover:border-alpha-green/30 transition-colors">
                       <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Volatility Index</span>
                       <span className="text-slate-200 font-black italic">{selectedGame.line_movement === 0 ? "STABLE" : `${selectedGame.line_movement} PT SHIFT`}</span>
                    </div>
                    <div className="p-4 bg-dark-bg rounded-xl flex justify-between items-center border border-dark-border group hover:border-alpha-green/30 transition-colors">
                       <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Sharp Intensity</span>
                       <span className={`font-black uppercase tracking-tighter ${selectedGame.sharp_money_indicator > 0.7 ? 'text-alpha-green bg-alpha-green/10 px-2 rounded px-2' : 'text-slate-400'}`}>
                        {selectedGame.sharp_money_indicator > 0.8 ? 'Extreme' : selectedGame.sharp_money_indicator > 0.5 ? 'High' : 'Moderate'}
                       </span>
                    </div>
                    <div className="p-4 bg-dark-bg rounded-xl flex justify-between items-center border border-dark-border group hover:border-alpha-green/30 transition-colors">
                       <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Vegas Edge</span>
                       <span className="text-slate-200 font-black">+4.2 pts</span>
                    </div>
                  </div>
               </div>

               <button className="w-full bg-alpha-green text-black font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0_30px_rgba(0,255,65,0.4)] text-sm mb-4">
                 Open Market Position
               </button>
               <p className="text-center text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                 SECURED VIA ALPHA ENGINE ENCRYPTION // NO DATA RETAINED
               </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Game IQ™ Analyst Modal */}
      <AnimatePresence>
        {isGameIQOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGameIQOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-lg"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative bg-[#0a0a0c] border border-alpha-green/20 rounded-[2.5rem] p-10 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_150px_rgba(0,255,65,0.1)]"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-alpha-green rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.5)]">
                     <Brain size={22} className="text-black" />
                   </div>
                   <div>
                     <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Game IQ<span className="text-alpha-green text-sm italic lowercase align-top ml-1">™</span></h2>
                     <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Real-Time Analytical Breakdown Engine</p>
                   </div>
                </div>
                <button onClick={() => setIsGameIQOpen(false)} className="text-slate-500 hover:text-white p-2">
                   <X size={24} />
                </button>
              </div>

              {!iqResult && (
                <div className="flex-grow flex flex-col">
                   <div className="relative mb-8">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                     <input 
                       autoFocus
                       type="text" 
                       placeholder="Search team or select from active daily board..." 
                       className="w-full bg-dark-bg border border-dark-border rounded-2xl py-6 pl-16 pr-6 text-white text-lg font-black focus:border-alpha-green/50 focus:outline-none transition-all placeholder:text-slate-700"
                       value={iqQuery}
                       onChange={(e) => setIqQuery(e.target.value)}
                     />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 scrollbar-hide">
                     {filteredIqSearch.map(game => (
                       <button
                         key={game.id}
                         onClick={() => handleAnalyzeGame(game.id)}
                         className="p-6 bg-dark-surface/50 border border-dark-border rounded-2xl text-left hover:border-alpha-green/40 hover:bg-alpha-green/5 transition-all group"
                       >
                         <div className="flex justify-between items-center">
                            <div>
                               <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">{game.sport_key.split('_')[1]}</p>
                               <p className="text-xl font-black text-white uppercase italic group-hover:text-alpha-green transition-colors">{game.away_team} @ {game.home_team}</p>
                            </div>
                            <ArrowUpRight size={20} className="text-slate-700 group-hover:text-alpha-green group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                         </div>
                       </button>
                     ))}
                   </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-alpha-green/20 border-t-alpha-green rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain size={32} className="text-alpha-green animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Propagating Event State...</h3>
                    <p className="text-xs text-slate-500 font-mono animate-pulse">Running FAISS Parity Check • bloom-filter deduping • L1/L2 Cache Sync</p>
                  </div>
                </div>
              )}

              {iqResult && (
                <div className="flex-grow overflow-y-auto pr-2 scrollbar-hide">
                  <div className="bg-alpha-green/5 border border-alpha-green/20 rounded-3xl p-8 mb-8">
                     <div className="flex justify-between items-start mb-8">
                        <div>
                          <p className="text-[10px] text-alpha-green font-black uppercase tracking-[0.3em] mb-2 italic">Composite Edge Output</p>
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">{iqResult.game}</h4>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Alpha Score</p>
                          <p className="text-6xl font-black text-alpha-green font-mono tracking-tighter drop-shadow-[0_0_20px_rgba(0,255,65,0.4)]">{iqResult.alphaScore}</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                           <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Momentum Edge</p>
                           <p className="text-lg font-black text-white">+{iqResult.momentumEdge}%</p>
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                           <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Line Movement</p>
                           <p className="text-lg font-black text-alpha-green">{iqResult.lineMovement} Pts</p>
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                           <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Public Split</p>
                           <p className="text-lg font-black text-white">{iqResult.publicPercentage}%</p>
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                           <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Matchup IQ</p>
                           <p className="text-lg font-black text-white">{iqResult.matchupRating}/100</p>
                        </div>
                     </div>
                     <div className="mt-4 flex gap-6 px-2">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-alpha-green rounded-full"></div>
                           <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Market Vector: {iqResult.market_version}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Activity size={10} className="text-slate-500" />
                           <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Latent Ingestion: {iqResult.ingestion_latency}</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h5 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Database size={14} className="text-alpha-green" /> Structured Intelligence
                        {!iqResult.isPro && (
                          <span className="ml-2 px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[8px] font-black rounded uppercase flex items-center gap-1">
                            Pro Only
                          </span>
                        )}
                      </h5>
                      <div className="space-y-3">
                        {iqResult.structuredInsights.map((insight: string, i: number) => (
                           <div key={i} className={`p-4 rounded-r-xl text-[11px] font-mono leading-relaxed transition-all ${
                             iqResult.isPro 
                               ? 'bg-dark-bg border-l-2 border-alpha-green text-slate-300' 
                               : 'bg-white/5 border border-white/10 text-slate-500 italic'
                           }`}>
                             {insight}
                           </div>
                        ))}
                        {!iqResult.isPro && (
                          <button className="w-full mt-4 py-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-yellow-500 transition-all hover:text-black">
                            Unlock Full Pro Intelligence
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap size={14} className="text-alpha-green" /> AI Analytical Verdict
                      </h5>
                      <div className="p-6 bg-alpha-green/5 border border-alpha-green/20 rounded-2xl text-[13px] text-slate-200 font-medium leading-relaxed italic">
                        {iqResult.aiVerdict}
                      </div>
                      <div className="mt-6 p-6 border border-dark-border rounded-3xl text-center">
                         <p className="text-[10px] text-slate-500 uppercase font-black mb-3 italic">Recommendation Confidence</p>
                         <div className="text-3xl font-black text-white italic truncate tracking-tighter">
                            {iqResult.alphaScore > 80 ? 'PREMIUM ALPHA' : iqResult.alphaScore > 65 ? 'VALUE SIGNAL' : 'NEUTRAL MARKET'}
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-4">
                     <button className="flex-1 bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-slate-200 transition-all text-xs" onClick={() => setIqResult(null)}>
                       Analyze Another Game
                     </button>
                     <button className="flex-1 bg-alpha-green text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-[#00cc34] transition-all text-xs">
                       View Full Pro Breakdown
                     </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
