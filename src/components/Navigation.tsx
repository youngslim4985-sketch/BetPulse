import React from 'react';
import { 
  BarChart3, 
  Brain, 
  Database, 
  Activity, 
  ShieldCheck, 
  User,
  LayoutDashboard,
  Search,
  Bell,
  Layers
} from 'lucide-react';
import { ViewType } from '../types';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const navItems = [
    { id: 'LANDING' as ViewType, label: 'Observer', icon: LayoutDashboard },
    { id: 'DASHBOARD' as ViewType, label: 'Pulse', icon: Activity },
    { id: 'MARKETS' as ViewType, label: 'Markets', icon: Search },
    { id: 'INTELLIGENCE' as ViewType, label: 'Intelligence', icon: Brain },
    { id: 'RESEARCH' as ViewType, label: 'Research', icon: Database },
    { id: 'PORTFOLIO' as ViewType, label: 'Portfolio', icon: User },
    { id: 'DEVELOPER' as ViewType, label: 'API Console', icon: Layers },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-20 lg:w-64 bg-dark-surface border-r border-dark-border flex flex-col items-center lg:items-start p-6 z-40">
      <div className="flex items-center gap-4 mb-12 lg:px-4 cursor-pointer" onClick={() => onViewChange('LANDING')}>
        <div className="w-10 h-10 bg-alpha-green rounded-xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(0,255,65,0.3)]">
          LB
        </div>
        <div className="hidden lg:block">
          <h2 className="text-sm font-black text-white italic tracking-tighter uppercase whitespace-nowrap">Line Breaker<span className="text-alpha-green ml-1 lowercase">™</span></h2>
          <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mt-0.5 whitespace-nowrap italic">Line Breaker Score™</p>
        </div>
      </div>

      <div className="flex-grow w-full space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-4 p-3 lg:px-6 rounded-2xl transition-all group ${
              currentView === item.id 
                ? 'bg-alpha-green/10 text-alpha-green' 
                : 'text-slate-500 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={20} className={currentView === item.id ? 'stroke-[2.5px]' : ''} />
            <span className="hidden lg:block text-xs font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="w-full space-y-4 pt-12 border-t border-white/5">
        <button className="w-full flex items-center gap-4 p-3 lg:px-6 text-slate-600 hover:text-alpha-green transition-colors">
          <Bell size={20} />
          <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">Alerts</span>
        </button>
        <div className="hidden lg:block px-6">
          <div className="p-4 bg-alpha-green/5 border border-alpha-green/20 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 bg-alpha-green rounded-full animate-pulse" />
              <span className="text-[8px] text-alpha-green font-black uppercase">System Online</span>
            </div>
            <p className="text-[9px] text-slate-500 leading-tight">Truth Firewall Active. CAS Engine Synced.</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
