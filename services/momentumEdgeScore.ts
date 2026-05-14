import { estimateSharpMoney } from './sharpMoney.ts';

export interface MomentumScoreInput {
  sportKey?: string;
  lineMovement: number;
  publicPercentage: number;
  matchupRating: number;
  momentumEdge: number;
  betPercentageOnFavorite?: number | null;
}

export function calculateMomentumEdgeScore({
  lineMovement = 0,
  publicPercentage = 50,
  matchupRating = 60,
  momentumEdge = 65, // This is our Edge Factor (Internal Signal)
}: MomentumScoreInput): number {

  const sharpPercentage = estimateSharpMoney({
    lineMovement,
    publicBetPercentage: publicPercentage,
  });

  /**
   * Momentum Edge™ Formula (Production Version)
   * Weights:
   * 30% - Normalized Line Movement Intensity
   * 25% - Sharp Money Indicator (RLM + Steam)
   * 15% - Public Contrarianism
   * 15% - Matchup Quality
   * 15% - Momentum Edge Variable (Internal Edge Factor)
   */
  
  // Normalize line movement: 1.0 point shift = 5 units. Cap at 10 (which is 50 normalized units)
  const normalizedMovement = Math.min(10, Math.abs(lineMovement) * 5);

  const score = 
    (normalizedMovement * 0.30) +
    (sharpPercentage * 0.25) +
    ((100 - publicPercentage) * 0.15) +
    (matchupRating * 0.15) +
    (momentumEdge * 0.15);

  return Math.min(100, Math.max(0, Math.round(score)));
}
