import { feedbackOrchestrator } from './FeedbackOrchestrator';
import { estimateSharpMoney } from './sharpMoney';
import { generateGameIQInsights } from './insightEngine';
import { SignalType } from './FeedbackContract';

export interface RawMarketUpdate {
  symbol: string;
  price: number;
  lineMovement: number;
  publicPercentage: number;
  edgeFactor: number;
  matchupRating: number;
}

export class SharpMoneyPipeline {
  /**
   * Main entry for processing raw market movements into high-fidelity signals
   */
  public processUpdate(update: RawMarketUpdate) {
    const sharpScore = estimateSharpMoney({
      lineMovement: update.lineMovement,
      publicBetPercentage: update.publicPercentage
    });

    const insights = generateGameIQInsights({
      lineMovement: update.lineMovement,
      sharpPercentage: sharpScore,
      publicPercentage: update.publicPercentage,
      matchupRating: update.matchupRating,
      edgeFactor: update.edgeFactor
    });

    // Detect Signal Types
    if (update.publicPercentage > 70 && update.lineMovement < 0) {
      this.emitSignal('REVERSE_LINE_MOVEMENT', update, sharpScore / 100);
    }

    if (Math.abs(update.lineMovement) > 1.5) {
      this.emitSignal('STEAM_MOVE', update, sharpScore / 100);
    }
    
    // Default to SHARP_INFLOW if score is high
    if (sharpScore > 80) {
      this.emitSignal('SHARP_INFLOW', update, sharpScore / 100);
    }

    return {
      sharpScore,
      insights
    };
  }

  private emitSignal(type: SignalType, update: RawMarketUpdate, confidence: number) {
    const features = {
      line_movement: update.lineMovement,
      public_sentiment: update.publicPercentage,
      edge_factor: update.edgeFactor,
      matchup_rating: update.matchupRating
    };

    feedbackOrchestrator.onSignal(
      type,
      update.symbol,
      confidence,
      features
    );
  }
}

export const sharpMoneyPipeline = new SharpMoneyPipeline();
