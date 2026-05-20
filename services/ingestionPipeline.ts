import { marketStateBus, MarketUpdate } from './marketState';

const PROVIDERS = ['PINNACLE', 'DRAFTKINGS', 'FANDUEL', 'SHARP_FEED_A'];
const GAMES = ['NBA:LAL@GSW', 'NBA:BOS@MIA', 'MLB:NYY@BOS', 'EPL:MCI@RMA'];

let globalSequence = 1000;

export function startIngestionPipeline() {
  setInterval(() => {
    // 20% chance of a "Semantic Gap" (simulating connection drop)
    if (Math.random() < 0.20) return;

    const game = GAMES[Math.floor(Math.random() * GAMES.length)];
    const provider = PROVIDERS[Math.floor(Math.random() * PROVIDERS.length)];
    
    globalSequence++;

    const update: MarketUpdate = {
      symbol: game,
      price: -110 + (Math.random() * 20 - 10),
      seq: globalSequence,
      provider: provider,
      timestamp: Date.now()
    };

    marketStateBus.project(update);
  }, 800); // Higher frequency matching professional feeds
}
