/**
 * Player Prop Edge Score™ Engine
 * Analyzes player props by comparing bookmaker lines against projected performance and recent trends.
 */
export interface PlayerPropInput {
  sportKey: string;
  propType: string;         // e.g., 'points', 'rebounds', 'strikeouts', 'goals'
  lineValue: number;
  projectedValue: number;   // From internal projection model
  overOdds: number;
  underOdds: number;
  recentAvg: number;        // Average of last 5-10 games
  recentTrend: number;      // positive = improving, negative = declining
}

export function calculatePlayerPropEdge({
  lineValue,
  projectedValue,
  overOdds,
  recentTrend
}: PlayerPropInput): number {
  
  // 1. Calculate Percentage Edge
  // How much does our projection differ from the bookie line?
  const rawEdge = ((projectedValue - lineValue) / lineValue) * 100;

  // 2. Implied Probability Check (Vigorish Adjustment)
  const impliedProbOver = overOdds > 0 
    ? 100 / (overOdds + 100) 
    : (overOdds < 0 ? Math.abs(overOdds) / (Math.abs(overOdds) + 100) : 0.5);

  let propScore = 50;

  // Base scoring on raw statistical edge
  if (Math.abs(rawEdge) > 15) {
    propScore = 85 + Math.min(Math.abs(rawEdge) / 2, 10);
  } else if (Math.abs(rawEdge) > 8) {
    propScore = 75 + Math.abs(rawEdge);
  } else {
    propScore = 60 + Math.abs(rawEdge);
  }

  // Momentum Multiplier: If the player is trending up and we like the Over
  if (recentTrend > 0 && rawEdge > 0) {
    propScore += 7;
  }
  
  // Market Alignment: If the 'Over' is heavily juiced (-140 etc), it signals pro money
  if (overOdds < -130) {
    propScore += 5;
  }

  return Math.min(100, Math.max(0, Math.round(propScore)));
}
