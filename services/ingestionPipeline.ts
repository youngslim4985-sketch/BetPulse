import { marketStateBus, MarketUpdate } from './marketState.ts';

/**
 * Line Breaker™ Ingestion Pipeline Simulator
 * Generates high-velocity, jittery odds data to test state projection resilience.
 */

const PROVIDERS = ['PINNACLE', 'DRAFTKINGS', 'FANDUEL', 'SHARP_FEED_A'];
const GAMES = ['NBA:LAL@GSW', 'NBA:BOS@MIA', 'MLB:NYY@BOS', 'EPL:MCI@RMA'];

let globalSequence = 1000;

export function startIngestionPipeline() {
  console.log('🚀 [INGESTION] Initializing High-Velocity Market Feed...');

  // Simulate constant stream of updates
  setInterval(() => {
    const game = GAMES[Math.floor(Math.random() * GAMES.length)];
    const provider = PROVIDERS[Math.floor(Math.random() * PROVIDERS.length)];
    
    globalSequence++;

    // CREATE JITTER: Occasionally send messages out of order to test CAS logic
    const chanceOfJitter = Math.random() < 0.15;
    const seq = chanceOfJitter ? globalSequence - 5 : globalSequence;

    const update: MarketUpdate = {
      symbol: game,
      price: -110 + (Math.random() * 20 - 10),
      seq: seq,
      provider: provider,
      timestamp: Date.now()
    };

    const accepted = marketStateBus.project(update);
    
    if (!accepted && !chanceOfJitter) {
      // Something actually went wrong if it's not simulated jitter
      console.warn(`⚠️ [PIPELINE] Potential Data Corruption: Seq ${seq} rejected for ${game}`);
    }
  }, 500); // 2 updates per second per game (scaled down for demo but logic is high-velocity)
}
