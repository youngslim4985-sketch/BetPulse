import { SignalOutcome, EvaluatedOutcome } from './FeedbackContract';

export type EvaluatorFunction = (outcome: SignalOutcome) => Omit<EvaluatedOutcome, 'signal_id' | 'definition_id'>;

export class EvaluationEngine {
  private evaluators: Map<string, EvaluatorFunction> = new Map();

  constructor() {
    this.registerDefaultEvaluators();
  }

  private registerDefaultEvaluators() {
    // CLV (Closing Line Value) Success
    this.evaluators.set('CLV_BEAT', (outcome) => {
      const startPrice = Object.values(outcome.facts)[0]?.price || 0;
      const closingPrice = outcome.facts[24 * 60 * 60 * 1000]?.price || startPrice;
      
      const is_success = closingPrice > startPrice;
      return {
        is_success,
        roi: is_success ? 0.05 : -0.05,
        pnl: is_success ? 5 : -5
      };
    });

    // MFE Momentum Success
    this.evaluators.set('MOMENTUM_CAPTURE', (outcome) => {
      const is_success = outcome.mfe > 2.0; // Simulated threshold
      return {
        is_success,
        roi: is_success ? 0.10 : -0.10,
        pnl: is_success ? 10 : -10
      };
    });
  }

  public evaluate(outcome: SignalOutcome): EvaluatedOutcome[] {
    const results: EvaluatedOutcome[] = [];
    
    this.evaluators.forEach((evaluator, definition_id) => {
      const result = evaluator(outcome);
      results.push({
        signal_id: outcome.signal_id,
        definition_id,
        ...result
      });
    });

    return results;
  }

  /**
   * Replay a new definition over historical facts
   */
  public replayDefinition(definition_id: string, outcomes: SignalOutcome[]): EvaluatedOutcome[] {
    const evaluator = this.evaluators.get(definition_id);
    if (!evaluator) return [];

    return outcomes.map(o => ({
      signal_id: o.signal_id,
      definition_id,
      ...evaluator(o)
    }));
  }
}

export const evaluationEngine = new EvaluationEngine();
