import { marketStateBus, MarketUpdate } from './marketState';
import { sharpMoneyPipeline } from './SharpMoneyPipeline';

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

    // Generate random but structured data for signal detection
    const lineMovement = (Math.random() * 4 - 2); // -2 to +2 points
    const publicPercentage = Math.floor(Math.random() * 60 + 20); // 20% to 80%
    const edgeFactor = Math.floor(Math.random() * 100);
    const matchupRating = Math.floor(Math.random() * 100);

    const update: MarketUpdate = {
      symbol: game,
      price: -110 + (Math.random() * 20 - 10),
      seq: globalSequence,
      provider: provider,
      timestamp: Date.now()
    };

    // Project into market state (Truth Firewall)
    marketStateBus.project(update);

    // Run Sharp Money Pipeline (Signal Detection & Feedback Loop)
    sharpMoneyPipeline.processUpdate({
      symbol: game,
      price: update.price,
      lineMovement,
      publicPercentage,
      edgeFactor,
      matchupRating
    });

  }, 800); // Higher frequency matching professional feeds
}
