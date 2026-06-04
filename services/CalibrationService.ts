import { SignalMetrics, EvaluatedOutcome, SignalRecord, SignalType } from './FeedbackContract';

export class CalibrationService {
  private metrics: Map<string, SignalMetrics> = new Map();

  /**
   * Nightly batch logic (Simulated here)
   */
  public calibrate(signals: SignalRecord[], outcomes: EvaluatedOutcome[]): void {
    const grouped = this.groupByFingerprint(signals, outcomes);

    grouped.forEach((data, key) => {
      const sample_size = data.results.length;
      const wins = data.results.filter(r => r.is_success).length;
      const rois = data.results.map(r => r.roi);
      
      const avg_roi = rois.reduce((a, b) => a + b, 0) / sample_size;
      const std_roi = Math.sqrt(rois.map(x => Math.pow(x - avg_roi, 2)).reduce((a, b) => a + b, 0) / sample_size) || 1;

      this.metrics.set(key, {
        type: key,
        sample_size,
        win_rate: wins / sample_size,
        avg_roi,
        median_roi: this.median(rois),
        sharpe_ratio: avg_roi / std_roi,
        reliable: sample_size >= 30
      });
    });
  }

  private groupByFingerprint(signals: SignalRecord[], outcomes: EvaluatedOutcome[]) {
    const map = new Map<string, { signals: SignalRecord[], results: EvaluatedOutcome[] }>();
    
    // Create map of outcomes for fast lookup
    const outcomeMap = new Map<string, EvaluatedOutcome[]>();
    outcomes.forEach(o => {
      const list = outcomeMap.get(o.signal_id) || [];
      list.push(o);
      outcomeMap.set(o.signal_id, list);
    });

    signals.forEach(s => {
      const key = s.fingerprint;
      const current = map.get(key) || { signals: [], results: [] };
      const results = outcomeMap.get(s.id) || [];
      
      current.signals.push(s);
      current.results.push(...results);
      map.set(key, current);
      
      // Also group by SignalType
      const typeKey = s.type;
      const typeCurrent = map.get(typeKey) || { signals: [], results: [] };
      typeCurrent.signals.push(s);
      typeCurrent.results.push(...results);
      map.set(typeKey, typeCurrent);
    });

    return map;
  }

  private median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const half = Math.floor(sorted.length / 2);
    if (sorted.length % 2) return sorted[half];
    return (sorted[half - 1] + sorted[half]) / 2.0;
  }

  public getMetrics(key: string): SignalMetrics | undefined {
    return this.metrics.get(key);
  }
}

export const calibrationService = new CalibrationService();
