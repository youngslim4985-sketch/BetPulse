/**
 * Line Breaker™ State Projection Engine
 * Implements atomic Compare-And-Swap (CAS) logic for market updates.
 * Mimics the Redis Lua script behavior for high-consistency state management.
 */

export interface MarketUpdate {
  symbol: string;      // e.g., 'NBA:LAL@GSW'
  propId?: string;
  price: number;
  seq: number;         // Sequence number for atomic versioning
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
  // In-memory state store (Simulating Redis)
  private state: Map<string, MarketState> = new Map();
  private stats = {
    updatesProcessed: 0,
    updatesDropped: 0,
    seqMismatches: 0,
    avgLatency: 12, // ms
  };

  /**
   * Atomic Projection Logic (CAS)
   * Prevents older messages from overwriting newer state during network jitter.
   */
  public project(update: MarketUpdate): boolean {
    const current = this.state.get(update.symbol);
    this.stats.updatesProcessed++;

    // Atomic Version Check: If the incoming seq is older than current, drop it.
    if (current && update.seq <= current.seq) {
      this.stats.updatesDropped++;
      this.stats.seqMismatches++;
      return false; // Stale data rejected
    }

    // Update state (This would be the EVALSHA script in production)
    this.state.set(update.symbol, {
      price: update.price,
      seq: update.seq,
      lastUpdated: update.timestamp,
      provider: update.provider
    });

    return true;
  }

  public getState(symbol: string): MarketState | undefined {
    return this.state.get(symbol);
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
