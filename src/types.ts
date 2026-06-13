export type ViewType = 'LANDING' | 'DASHBOARD' | 'MARKETS' | 'INTELLIGENCE' | 'RESEARCH' | 'PORTFOLIO' | 'DEVELOPER';

export interface PerformanceStats {
  alphaScore: number; // This will now represent LBS™
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

export type ScoreClassification = 'ELITE' | 'STRONG' | 'POSITIVE' | 'NEUTRAL' | 'AVOID';

export interface MarketItem {
  id: string;
  symbol: string;
  description: string;
  lbsScore: number;
  classification: ScoreClassification;
  type: 'NBA' | 'NFL' | 'MLB' | 'SOCCER';
}
