/**
 * Edge Factor Component Engine
 * Calculates the internal 'legitimacy' of a pick based on non-market factors.
 */
export interface EdgeFactorInput {
  injuryImpact: number;     // 0-100 (e.g., Star QB out = 90)
  weatherImpact: number;    // 0-100 (e.g., Heavy wind = 70)
  travelFatigue: number;    // 0-100 (e.g., Back-to-back road games = 80)
  recentForm: number;       // 0-100 (Trend of last 5 games)
  modelSignal: number;      // 0-100 (Pure statistical model conviction)
}

export function calculateEdgeFactor({
  injuryImpact = 0,
  weatherImpact = 0,
  travelFatigue = 0,
  recentForm = 50,
  modelSignal = 50
}: Partial<EdgeFactorInput>): number {
  /**
   * Momentum Edge™ Variable Weights:
   * 25% - Injury Impact
   * 15% - Weather Impact
   * 15% - Travel Fatigue
   * 20% - Recent Form
   * 25% - Model Signal
   */
  const score =
    (injuryImpact * 0.25) +
    (weatherImpact * 0.15) +
    (travelFatigue * 0.15) +
    (recentForm * 0.20) +
    (modelSignal * 0.25);

  return Math.min(100, Math.max(0, Math.round(score)));
}
