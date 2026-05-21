export type ViewType = 'DASHBOARD' | 'MARKETS' | 'INTELLIGENCE' | 'RESEARCH' | 'PORTFOLIO';

export interface PerformanceStats {
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

export interface MarketItem {
  id: string;
  symbol: string;
  description: string;
  edgeScore: number;
  type: 'NBA' | 'NFL' | 'MLB' | 'SOCCER';
}
