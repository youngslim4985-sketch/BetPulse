export type SignalType = 'STEAM_MOVE' | 'REVERSE_LINE_MOVEMENT' | 'SHARP_INFLOW' | 'VOL_COMPRESSION' | 'LIQUIDITY_ANOMALY';

export interface SignalRecord {
  id: string; // UUID v4
  type: SignalType;
  market_id: string;
  signal_time: number; // Unix timestamp
  raw_confidence: number; // 0.0 - 1.0
  effective_confidence?: number;
  features: {
    [key: string]: number;
  };
  fingerprint: string; // Composite fingerprint
}

export interface SignalOutcome {
  signal_id: string;
  facts: {
    [horizon_ms: number]: {
      price: number;
      collected_at: number;
    };
  };
  mfe: number; // Max Favorable Excursion
  mae: number; // Max Adverse Excursion
}

export interface EvaluatedOutcome {
  signal_id: string;
  definition_id: string;
  is_success: boolean;
  roi: number;
  pnl: number;
}

export interface SignalMetrics {
  type: SignalType | 'GLOBAL' | string; // Specific type or composite fingerprint
  sample_size: number;
  win_rate: number;
  avg_roi: number;
  median_roi: number;
  sharpe_ratio: number; // avg_roi / std_roi
  reliable: boolean;
}

export interface BayesianPrior {
  alpha: number;
  beta: number;
  posterior_mean: number;
  last_updated: number;
}

export type CompositeFingerprint = string;
