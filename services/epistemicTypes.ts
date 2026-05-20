/**
 * Line Breaker™ Epistemic Schema
 * Defines the semantic contract of truth under uncertainty.
 */

export type DataSource = 'EVENT' | 'SNAPSHOT' | 'INFERENCE';

export interface ConfidenceVector {
  overall: number;            // 0.0 to 1.0
  completeness: number;       // Data coverage 
  temporal_continuity: number; // Jitter impact
  provider_integrity: number; // Source reliability
  inference_dependency: number; // Ratio of synthetic vs observed
}

export interface GapSegment {
  start: number;
  end: number;
  gap_size_ms: number;
  strategy: 'BOUNDED_HOLD' | 'LINEAR_INTERPOLATION' | 'HYPOTHETICAL_CONTINUATION';
  inferred: boolean;
}

export interface MarketStateBlob {
  price: number;
  seq: number;
  volume_24h?: number;
  last_observed_ticker?: string;
}

export interface ReconstructionResult {
  market_id: string;
  timestamp: number;
  
  state: {
    snapshot_id: string;
    blob: MarketStateBlob;
  };

  confidence: ConfidenceVector;

  provenance: {
    snapshot_used: string;
    event_ids_used: string[];
    gap_segments: GapSegment[];
    inference_type?: string;
  };

  flags: {
    is_reconstructed: boolean;
    contains_inference: boolean;
    low_confidence: boolean;
  };
}
