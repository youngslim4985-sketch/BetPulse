import { estimateSharpMoney } from './sharpMoney.ts';

export interface MomentumScoreInput {
  sportKey: string;
  lineMovement: number;
  publicPercentage: number;
  matchupRating: number;
  momentumEdge: number;
  betPercentageOnFavorite?: number | null;
}

export function calculateMomentumEdgeScore({
  sportKey,
  lineMovement = 0,
  publicPercentage = 50,
  matchupRating = 60,
  momentumEdge = 65,
  betPercentageOnFavorite = null
}: MomentumScoreInput): number {

  const sharpPercentage = estimateSharpMoney({
    lineMovement,
    publicBetPercentage: publicPercentage,
    betPercentageOnFavorite,
    sportKey
  });

  /**
   * Momentum Edge Score™ Formula
   * Sport-specific weight adjustments:
   * Spread-heavy sports (Football/Basketball) emphasize line movement.
   * Moneyline-heavy sports (Baseball/Soccer) emphasize sharp money indicators.
   */
  let lineWeight = 0.32;
  let sharpWeight = 0.28;

  if (['baseball_mlb', 'soccer_epl', 'soccer_laliga'].includes(sportKey)) {
    lineWeight = 0.22;      // Moneyline shifts are smaller relatively
    sharpWeight = 0.38;     // Professional steam is huge in ML sports
  } else if (sportKey.includes('ncaaf') || sportKey.includes('ncaab')) {
    lineWeight = 0.30;      // College variance handling
    sharpWeight = 0.30;
  }

  const score = 
    (Math.abs(lineMovement) * lineWeight) +
    (sharpPercentage * sharpWeight) +
    ((100 - publicPercentage) * 0.16) +
    (matchupRating * 0.12) +
    (momentumEdge * 0.12);

  return Math.min(100, Math.max(0, Math.round(score)));
}
