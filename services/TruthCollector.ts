import { SignalOutcome } from './FeedbackContract';

export interface IPriceFeed {
  getCurrentPrice(market_id: string): Promise<number>;
}

// Mock Price Feed for simulation
const mockPriceFeed: IPriceFeed = {
  getCurrentPrice: async () => -110 + (Math.random() * 20 - 10)
};

class TruthCollector {
  private outcomes: Map<string, SignalOutcome> = new Map();
  private pendingCollections: Array<{
    signal_id: string;
    market_id: string;
    horizon_ms: number;
    target_time: number;
  }> = [];

  constructor(private priceFeed: IPriceFeed = mockPriceFeed) {
    this.startPollLoop();
  }

  public scheduleCollection(signal_id: string, market_id: string, signal_time: number) {
    const horizons = [
      5 * 60 * 1000,      // 5m
      15 * 60 * 1000,     // 15m
      30 * 60 * 1000,     // 30m
      60 * 60 * 1000,     // 1h
      4 * 60 * 60 * 1000, // 4h
      24 * 60 * 60 * 1000 // 24h
    ];

    horizons.forEach(horizon => {
      this.pendingCollections.push({
        signal_id,
        market_id,
        horizon_ms: horizon,
        target_time: signal_time + horizon
      });
    });

    if (!this.outcomes.has(signal_id)) {
      this.outcomes.set(signal_id, {
        signal_id,
        facts: {},
        mfe: 0,
        mae: 0
      });
    }
  }

  private startPollLoop() {
    setInterval(async () => {
      const now = Date.now();
      const captures = this.pendingCollections.filter(c => now >= c.target_time);
      this.pendingCollections = this.pendingCollections.filter(c => now < c.target_time);

      for (const capture of captures) {
        const price = await this.priceFeed.getCurrentPrice(capture.market_id);
        this.recordFact(capture.signal_id, capture.horizon_ms, price);
      }
    }, 60000); // 60s poll
  }

  private recordFact(signal_id: string, horizon_ms: number, price: number) {
    const outcome = this.outcomes.get(signal_id);
    if (outcome) {
      outcome.facts[horizon_ms] = {
        price,
        collected_at: Date.now()
      };
      
      // Update MFE/MAE (Simplified calculation)
      const prices = Object.values(outcome.facts).map(f => f.price);
      outcome.mfe = Math.max(...prices, outcome.mfe);
      outcome.mae = Math.min(...prices, outcome.mae);
    }
  }

  public getOutcome(signal_id: string): SignalOutcome | undefined {
    return this.outcomes.get(signal_id);
  }
}

export const truthCollector = new TruthCollector();
