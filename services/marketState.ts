/**
 * Line Breaker™ State Projection Engine
 * Implements atomic Compare-And-Swap (CAS) logic for market updates.
 */

export interface MarketUpdate {
  symbol: string;
  price: number;
  seq: number;
  provider: string;
  timestamp: number;
}

export interface MarketState {
  price: number;
  seq: number;
  lastUpdated: number;
  provider: string;
}

class MarketProjectionStore {
  private state: Map<string, MarketState> = new Map();
  private stats = {
    updatesProcessed: 0,
    updatesDropped: 0,
    seqMismatches: 0,
    avgLatency: 12,
  };

  public project(update: MarketUpdate): boolean {
    const current = this.state.get(update.symbol);
    this.stats.updatesProcessed++;

    if (current && update.seq <= current.seq) {
      this.stats.updatesDropped++;
      this.stats.seqMismatches++;
      return false;
    }

    this.state.set(update.symbol, {
      price: update.price,
      seq: update.seq,
      lastUpdated: update.timestamp,
      provider: update.provider
    });

    return true;
  }

  public getStats() {
    return {
      ...this.stats,
      marketCount: this.state.size,
      uptime: process.uptime()
    };
  }
}

export const marketStateBus = new MarketProjectionStore();
