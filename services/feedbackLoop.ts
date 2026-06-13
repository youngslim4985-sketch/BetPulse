import * as crypto from 'crypto';
import { SignalRecord } from './FeedbackContract';
import { signalRegistry } from './SignalRegistry';
import { getOrCreateAggregate } from './rateLimiter';

export interface RiskDecision {
  id: string; // matches signalId
  marketId: string;
  timestamp: number;
  features: {
    line_movement: number;
    public_sentiment: number;
    edge_factor: number;
    matchup_rating: number;
    [key: string]: number;
  };
  finalScore: number; // final champion score
  
  // Versions
  featureVersion: string;
  modelVersion: string;
  graphVersion: string;

  // Shadow evaluations
  championScore: number;
  challengerScore: number;
  championDecision: 'ALERT_AUTO_FLAG' | 'MONITOR_RECOMMENDED' | 'PASS_STATIONARY';
  challengerDecision: 'ALERT_AUTO_FLAG' | 'MONITOR_RECOMMENDED' | 'PASS_STATIONARY';
  
  // Outcomes & Labels
  label: 'clv_beat' | 'clv_miss' | 'clv_push' | 'unresolved' | string | null;
  labelAt: number | null;
  labelSource: 'WEBHOOK_STRIPE' | 'ORACLE_MANUAL' | 'PIPELINE_AUTO' | string | null;
}

export interface ModelDriftMetric {
  id: string;
  featureName: string;
  psi: number; // Population Stability Index
  baselineMean: number;
  currentMean: number;
  driftDetected: boolean;
  createdAt: number;
}

export interface ModelPerformanceReport {
  modelName: string;
  version: string;
  precision: number;
  recall: number;
  accuracy: number;
  f1Score: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  roi: number; // Returns in percent e.g. 5.4%
  totalEvaluated: number;
}

export class FeedbackLoopManager {
  public decisions: Map<string, RiskDecision> = new Map();
  public driftMetrics: ModelDriftMetric[] = [];
  
  // Current models
  public championModelName = 'LBS_Entropy_Core';
  public championModelVersion = 'v4.2';
  public challengerModelName = 'LBS_Bayesian_Boost';
  public challengerModelVersion = 'v5.0';

  // Versions
  public featureVersion = 'v2.4';
  public graphVersion = 'v1.8';

  // Base distributions for drift calculations (seeded at boot)
  private baselineFeatures: Record<string, number[]> = {
    line_movement: [],
    public_sentiment: [],
    edge_factor: [],
    matchup_rating: [],
    score: []
  };

  constructor() {
    this.seedBaselines();
    this.seedHistoricalDecisions();
    this.recalculateDrift();
  }

  private seedBaselines() {
    // Generate ~200 items for healthy baseline distribution
    for (let i = 0; i < 200; i++) {
      this.baselineFeatures.line_movement.push(-1.5 + Math.random() * 3.0);
      this.baselineFeatures.public_sentiment.push(20 + Math.random() * 60);
      this.baselineFeatures.edge_factor.push(30 + Math.random() * 40);
      this.baselineFeatures.matchup_rating.push(40 + Math.random() * 50);
      this.baselineFeatures.score.push(0.3 + Math.random() * 0.5);
    }
  }

  private seedHistoricalDecisions() {
    const listGames = ['NBA:LAL@GSW', 'NBA:BOS@MIA', 'MLB:NYY@BOS', 'EPL:MCI@RMA'];
    const now = Date.now();

    // Seed 120 historical decisions spread over 15 days
    for (let i = 120; i > 0; i--) {
      const decisionTime = now - i * 3 * 60 * 60 * 1000; // 3 hours gap
      const game = listGames[Math.floor(Math.random() * listGames.length)];
      
      const line_movement = -2.0 + Math.random() * 4.0;
      const public_sentiment = 15 + Math.floor(Math.random() * 70);
      const edge_factor = 20 + Math.floor(Math.random() * 75);
      const matchup_rating = 30 + Math.floor(Math.random() * 65);
      
      const features = { line_movement, public_sentiment, edge_factor, matchup_rating };
      
      // Champion score formula with slight deterministic variance
      const championScore = Math.min(0.99, Math.max(0.01, 
        0.35 + (edge_factor / 150) + (public_sentiment > 65 ? 0.15 : 0.0) + (Math.abs(line_movement) > 1.2 ? 0.1 : 0.0) + (Math.random() * 0.1 - 0.05)
      ));

      // Challenger is slightly better at using 'edge_factor'
      const challengerScore = Math.min(0.99, Math.max(0.01, 
        0.30 + (edge_factor / 120) + (public_sentiment > 70 ? 0.10 : 0.0) + (Math.abs(line_movement) > 1.4 ? 0.15 : 0.0) + (Math.random() * 0.06 - 0.03)
      ));

      // Assign decisions
      const chamDec = championScore > 0.70 ? 'ALERT_AUTO_FLAG' : (championScore > 0.45 ? 'MONITOR_RECOMMENDED' : 'PASS_STATIONARY');
      const chalDec = challengerScore > 0.68 ? 'ALERT_AUTO_FLAG' : (challengerScore > 0.40 ? 'MONITOR_RECOMMENDED' : 'PASS_STATIONARY');

      // Random labels (Simulating Ground Truth line resolutions)
      // Champion has slightly higher false positives on extreme moves
      let label: string = 'unresolved';
      if (i > 15) { // Older than 15 decisions are fully resolved
        const rand = Math.random();
        if (chamDec === 'ALERT_AUTO_FLAG') {
          // 70% success for Champion
          label = rand < 0.72 ? 'clv_beat' : 'clv_miss';
        } else if (chamDec === 'MONITOR_RECOMMENDED') {
          label = rand < 0.50 ? 'clv_beat' : 'clv_miss';
        } else {
          label = rand < 0.35 ? 'clv_beat' : 'clv_miss';
        }
      }

      const id = 'sig_' + crypto.randomBytes(8).toString('hex');
      const decision: RiskDecision = {
        id,
        marketId: game,
        timestamp: decisionTime,
        features,
        finalScore: championScore,
        featureVersion: this.featureVersion,
        modelVersion: this.championModelVersion,
        graphVersion: this.graphVersion,
        championScore,
        challengerScore,
        championDecision: chamDec,
        challengerDecision: chalDec,
        label: label === 'unresolved' ? null : label,
        labelAt: label === 'unresolved' ? null : decisionTime + 2 * 60 * 60 * 1000,
        labelSource: label === 'unresolved' ? null : 'PIPELINE_AUTO'
      };

      this.decisions.set(id, decision);
    }
  }

  /**
   * Main score shadowing entry point during standard pipeline execution.
   * Compiles champion vs challenger in real-time.
   */
  public shadowScoreSignal(signal: SignalRecord): RiskDecision {
    const features = {
      line_movement: signal.features.line_movement || 0,
      public_sentiment: signal.features.public_sentiment || 0,
      edge_factor: signal.features.edge_factor || 0,
      matchup_rating: signal.features.matchup_rating || 0,
      ...signal.features
    };

    const raw = signal.raw_confidence;
    
    // Simulate Champion & Challenger executing different math models
    const championScore = Math.min(0.99, Math.max(0.01, raw));
    
    // Challenger relies more on non-linear interaction rules
    const edgeRatio = features.edge_factor / 100;
    const sentimentBonus = features.public_sentiment > 65 ? 0.12 : -0.05;
    const challengerScore = Math.min(0.99, Math.max(0.01, 
      (raw * 0.75) + (edgeRatio * 0.20) + (sentimentBonus * 0.10) + (Math.abs(features.line_movement) > 1.3 ? 0.08 : -0.02)
    ));

    const chamDec = championScore > 0.70 ? 'ALERT_AUTO_FLAG' : (championScore > 0.45 ? 'MONITOR_RECOMMENDED' : 'PASS_STATIONARY');
    const chalDec = challengerScore > 0.68 ? 'ALERT_AUTO_FLAG' : (challengerScore > 0.40 ? 'MONITOR_RECOMMENDED' : 'PASS_STATIONARY');

    const decision: RiskDecision = {
      id: signal.id,
      marketId: signal.market_id,
      timestamp: signal.signal_time,
      features,
      finalScore: championScore,
      featureVersion: this.featureVersion,
      modelVersion: this.championModelVersion,
      graphVersion: this.graphVersion,
      championScore,
      challengerScore,
      championDecision: chamDec,
      challengerDecision: chalDec,
      label: null,
      labelAt: null,
      labelSource: null
    };

    this.decisions.set(signal.id, decision);
    
    // Run real-time drift recalc after buffer thresholds
    if (this.decisions.size % 5 === 0) {
      this.recalculateDrift();
    }

    return decision;
  }

  /**
   * Applies ground truth labels manually or via automated webhook triggers
   */
  public labelEvent(id: string, label: 'clv_beat' | 'clv_miss' | 'clv_push', source: string = 'ORACLE_MANUAL'): boolean {
    const record = this.decisions.get(id);
    if (!record) return false;

    record.label = label;
    record.labelAt = Date.now();
    record.labelSource = source;

    console.log(`[FeedbackLoopManager] Event ${id} successfully labeled as "${label}" via ${source}.`);
    return true;
  }

  /**
   * Calculates the Population Stability Index (PSI) to detect model degradation
   */
  public calculatePSI(baseline: number[], current: number[], bucketsCount: number = 5): number {
    if (baseline.length === 0 || current.length === 0) return 0.0;
    
    // Sort baseline to partition into quantile thresholds
    const sortedBase = [...baseline].sort((a, b) => a - b);
    const bounds: number[] = [];
    for (let i = 1; i < bucketsCount; i++) {
      const idx = Math.floor((i / bucketsCount) * sortedBase.length);
      bounds.push(sortedBase[idx]);
    }

    const getBucket = (val: number): number => {
      for (let i = 0; i < bounds.length; i++) {
        if (val <= bounds[i]) return i;
      }
      return bounds.length;
    };

    const countBase = new Array(bucketsCount).fill(0);
    const countCur = new Array(bucketsCount).fill(0);

    baseline.forEach(v => { countBase[getBucket(v)]++; });
    current.forEach(v => { countCur[getBucket(v)]++; });

    let psi = 0.0;
    const eps = 0.0001; // Tiny jitter preventing division by zero or log of zero

    for (let i = 0; i < bucketsCount; i++) {
      const pExp = countBase[i] / baseline.length;
      const pAct = countCur[i] / current.length;

      const exp = pExp === 0 ? eps : pExp;
      const act = pAct === 0 ? eps : pAct;

      // Class PSI formula
      psi += (act - exp) * Math.log(act / exp);
    }

    return parseFloat(psi.toFixed(5));
  }

  /**
   * Re-evaluates entire system feature lines for drift
   */
  public recalculateDrift() {
    const listDecisions = Array.from(this.decisions.values());
    if (listDecisions.length === 0) return;

    // Grab the most recent 60 instances to compute active distributions
    const activeSample = listDecisions.slice(-65);
    
    const activeLineMoves = activeSample.map(d => d.features.line_movement);
    const activeSentiment = activeSample.map(d => d.features.public_sentiment);
    const activeEdge = activeSample.map(d => d.features.edge_factor);
    const activeMatchup = activeSample.map(d => d.features.matchup_rating);
    const activeScores = activeSample.map(d => d.finalScore);

    const getMean = (arr: number[]) => arr.reduce((s, x) => s + x, 0) / (arr.length || 1);

    const checkDrift = (name: string, active: number[], base: number[]): ModelDriftMetric => {
      const psi = this.calculatePSI(base, active, 5);
      return {
        id: 'drift_' + name,
        featureName: name,
        psi,
        baselineMean: parseFloat(getMean(base).toFixed(2)),
        currentMean: parseFloat(getMean(active).toFixed(2)),
        driftDetected: psi >= 0.25, // Standard benchmark threshold
        createdAt: Date.now()
      };
    };

    this.driftMetrics = [
      checkDrift('line_movement', activeLineMoves, this.baselineFeatures.line_movement),
      checkDrift('public_sentiment', activeSentiment, this.baselineFeatures.public_sentiment),
      checkDrift('edge_factor', activeEdge, this.baselineFeatures.edge_factor),
      checkDrift('matchup_rating', activeMatchup, this.baselineFeatures.matchup_rating),
      checkDrift('prediction_score_deviation', activeScores, this.baselineFeatures.score)
    ];
  }

  /**
   * Retrains the engine: Re-calibrates active models in line with baseline, resetting feature drift.
   */
  public triggerModelRetraining() {
    console.log('[FeedbackLoopManager] Retraining triggered. Re-aligning active lines back to expectation...');
    
    // Clear out anomalous feature entries and realign baseline
    const listDec = Array.from(this.decisions.values());
    
    // Push recent data back into baseline features to update statistical definitions
    listDec.slice(-50).forEach(d => {
      this.baselineFeatures.line_movement.push(d.features.line_movement);
      this.baselineFeatures.public_sentiment.push(d.features.public_sentiment);
      this.baselineFeatures.edge_factor.push(d.features.edge_factor);
      this.baselineFeatures.matchup_rating.push(d.features.matchup_rating);
      this.baselineFeatures.score.push(d.finalScore);

      // Keep baseline capped at 400 structures
      if (this.baselineFeatures.line_movement.length > 400) {
        Object.keys(this.baselineFeatures).forEach(k => this.baselineFeatures[k].shift());
      }
    });

    this.recalculateDrift();
  }

  /**
   * Elevates Challenger Model to production status (rebranding)
   */
  public promoteChallengerToChampion(): { success: boolean; message: string } {
    const prevChampion = `${this.championModelName} ${this.championModelVersion}`;
    const promotedChallenger = `${this.challengerModelName} ${this.challengerModelVersion}`;

    // Swap references
    this.championModelName = this.challengerModelName;
    this.championModelVersion = this.challengerModelVersion;

    // Reset Challenger to an upgraded neural networks version
    const nextVerNum = (parseFloat(this.challengerModelVersion.substring(1)) + 1.0).toFixed(1);
    this.challengerModelVersion = `v${nextVerNum}`;
    this.challengerModelName = 'LBS_Deep_Neural';

    // Clear resolved flag labels
    this.decisions.forEach(d => {
      // Re-evaluate previous outcomes with the new upgraded champion version tags
      d.modelVersion = this.championModelVersion;
    });

    return {
      success: true,
      message: `Successfully promoted ${promotedChallenger} to Active Champion! Old ${prevChampion} is now retired. Shadowing initialized on newer model ${this.challengerModelName} ${this.challengerModelVersion}.`
    };
  }

  /**
   * Generates confusion matrix, precision, recall, and profitability ROI for Champion vs Challenger
   */
  public compilePerformanceReports(): { champion: ModelPerformanceReport; challenger: ModelPerformanceReport } {
    const listDecisions = Array.from(this.decisions.values()).filter(d => d.label !== null && d.label !== 'unresolved');
    
    let champTP = 0, champFP = 0, champTN = 0, champFN = 0;
    let chalTP = 0, chalFP = 0, chalTN = 0, chalFN = 0;

    let champPnL = 0;
    let chalPnL = 0;

    listDecisions.forEach(d => {
      const isTrueValue = d.label === 'clv_beat';

      // Champion predictions
      const champPredictsAlert = d.championDecision === 'ALERT_AUTO_FLAG';
      if (champPredictsAlert) {
        if (isTrueValue) {
          champTP++;
          champPnL += 10; // $10 win
        } else {
          champFP++;
          champPnL -= 11.5; // $11.5 loss (vig included)
        }
      } else {
        if (isTrueValue) {
          champFN++;
        } else {
          champTN++;
        }
      }

      // Challenger predictions
      const chalPredictsAlert = d.challengerDecision === 'ALERT_AUTO_FLAG';
      if (chalPredictsAlert) {
        if (isTrueValue) {
          chalTP++;
          chalPnL += 10;
        } else {
          chalFP++;
          chalPnL -= 11.5;
        }
      } else {
        if (isTrueValue) {
          chalFN++;
        } else {
          chalTN++;
        }
      }
    });

    const calculateMetrics = (name: string, ver: string, tp: number, fp: number, tn: number, fn: number, pnl: number): ModelPerformanceReport => {
      const total = tp + fp + tn + fn;
      const precision = (tp + fp) === 0 ? 0.0 : tp / (tp + fp);
      const recall = (tp + fn) === 0 ? 0.0 : tp / (tp + fn);
      const accuracy = total === 0 ? 0.0 : (tp + tn) / total;
      const f1 = (precision + recall) === 0 ? 0.0 : 2 * (precision * recall) / (precision + recall);
      
      const totalCapitalInvested = (tp + fp) * 11;
      const roi = totalCapitalInvested === 0 ? 0.0 : (pnl / totalCapitalInvested) * 100;

      return {
        modelName: name,
        version: ver,
        precision: parseFloat(precision.toFixed(4)),
        recall: parseFloat(recall.toFixed(4)),
        accuracy: parseFloat(accuracy.toFixed(4)),
        f1Score: parseFloat(f1.toFixed(4)),
        truePositives: tp,
        falsePositives: fp,
        trueNegatives: tn,
        falseNegatives: fn,
        roi: parseFloat(roi.toFixed(1)),
        totalEvaluated: total
      };
    };

    return {
      champion: calculateMetrics(this.championModelName, this.championModelVersion, champTP, champFP, champTN, champFN, champPnL),
      challenger: calculateMetrics(this.challengerModelName, this.challengerModelVersion, chalTP, chalFP, chalTN, chalFN, chalPnL)
    };
  }

  /**
   * Export reconstructed historical training data as request arrays for models
   */
  public buildTrainingDataset(featVer?: string, modelVer?: string): any[] {
    let list = Array.from(this.decisions.values()).filter(d => d.label !== null && d.label !== 'unresolved');
    
    if (featVer) list = list.filter(d => d.featureVersion === featVer);
    if (modelVer) list = list.filter(d => d.modelVersion === modelVer);

    return list.map(d => ({
      id: d.id,
      features: d.features,
      champion_score: d.championScore,
      challenger_score: d.challengerScore,
      ground_truth_label: d.label,
      feature_version: d.featureVersion,
      model_version: d.modelVersion,
      graph_version: d.graphVersion,
      timestamp_epoch: d.timestamp
    }));
  }

  /**
   * Triggers a Stripe Webhook checkout dispute simulation (or manual outcome) to inject ground truth!
   */
  public triggerStripeWebhookSimulator(): { success: boolean; eventId: string; signalsAffected: number } {
    const listUnlabeled = Array.from(this.decisions.values()).filter(d => d.label === null);
    
    if (listUnlabeled.length === 0) {
      return { success: false, eventId: '', signalsAffected: 0 };
    }

    const eventId = 'stripe_evt_' + crypto.randomBytes(6).toString('hex');
    const takeCount = Math.min(listUnlabeled.length, 3);
    
    for (let i = 0; i < takeCount; i++) {
      const signal = listUnlabeled[i];
      // Randomly classify as clv_beat or clv_miss
      const label = Math.random() < 0.65 ? 'clv_beat' : 'clv_miss';
      this.labelEvent(signal.id, label, 'WEBHOOK_STRIPE');
    }

    return {
      success: true,
      eventId,
      signalsAffected: takeCount
    };
  }
}

export const feedbackLoopManager = new FeedbackLoopManager();
