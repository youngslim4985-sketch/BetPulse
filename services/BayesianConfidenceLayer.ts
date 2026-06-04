import { BayesianPrior, SignalRecord, SignalMetrics } from './FeedbackContract';
import { calibrationService } from './CalibrationService';

export class BayesianConfidenceLayer {
  private priors: Map<string, BayesianPrior> = new Map();

  /**
   * Adjust raw confidence based on historical performance distributions
   */
  public adjustConfidence(signal: SignalRecord): number {
    const raw = signal.raw_confidence;
    
    // 1. Try Fingerprint-level prior (most specific)
    let metrics = calibrationService.getMetrics(signal.fingerprint);
    
    // 2. Fallback to SignalType-level prior
    if (!metrics || !metrics.reliable) {
      metrics = calibrationService.getMetrics(signal.type);
    }

    if (!metrics || !metrics.reliable) {
      return raw; // Unchanged if no significant history
    }

    const prior = this.getOrUpdatePrior(metrics);
    const historicalAdjustment = prior.posterior_mean / 0.5; // Relativize to 50/50 baseline
    
    // Apply adjustment and cap at [0.01, 0.99]
    return Math.max(0.01, Math.min(0.99, raw * historicalAdjustment));
  }

  private getOrUpdatePrior(metrics: SignalMetrics): BayesianPrior {
    const key = metrics.type;
    const existing = this.priors.get(key);

    // If never seen or updated daily (simulated)
    if (!existing) {
      // Beta (α, β) distribution
      // Seed with α=1, β=1 (Bayesian Laplace smoothing)
      const alpha = 1 + (metrics.win_rate * metrics.sample_size);
      const beta = 1 + ((1 - metrics.win_rate) * metrics.sample_size);
      
      const prior: BayesianPrior = {
        alpha,
        beta,
        posterior_mean: alpha / (alpha + beta),
        last_updated: Date.now()
      };
      
      this.priors.set(key, prior);
      return prior;
    }

    return existing;
  }
}

export const bayesianConfidenceLayer = new BayesianConfidenceLayer();
