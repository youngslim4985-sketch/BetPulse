import { SignalRecord, SignalType } from './FeedbackContract';
import { signalRegistry } from './SignalRegistry';
import { truthCollector } from './TruthCollector';
import { bayesianConfidenceLayer } from './BayesianConfidenceLayer';
import { feedbackLoopManager } from './feedbackLoop';

export class FeedbackOrchestrator {
  /**
   * Complete Signal Lifecycle Ingestion
   * Called by the SharpMoneyPipeline in Sprint 3
   */
  public onSignal(
    type: SignalType, 
    market_id: string, 
    raw_confidence: number, 
    features: { [key: string]: number }
  ): SignalRecord {
    // 1. Create temporary record to generate fingerprint
    const tempRecord: SignalRecord = {
      id: 'TEMP',
      type,
      market_id,
      signal_time: Date.now(),
      raw_confidence,
      features,
      fingerprint: '' // Will be set by registry
    };

    // 2. Adjust confidence based on Bayesian history
    const effective_confidence = bayesianConfidenceLayer.adjustConfidence(tempRecord);

    // 3. Persist in immutable registry
    const record = signalRegistry.register({
      type,
      market_id,
      signal_time: Date.now(),
      raw_confidence,
      effective_confidence,
      features
    });

    // Run Champion/Challenger shadow evaluation immediately
    feedbackLoopManager.shadowScoreSignal(record);

    // 4. Schedule Truth Collection (Fact Finding)
    truthCollector.scheduleCollection(record.id, record.market_id, record.signal_time);

    console.log(`[FeedbackOrchestrator] Signal Registered: ${record.id} | Effective Confidence: ${effective_confidence.toFixed(4)}`);
    
    return record;
  }
}

export const feedbackOrchestrator = new FeedbackOrchestrator();
