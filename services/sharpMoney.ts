/**
 * Sharp Money Estimation Logic
 * Tracks Reverse Line Movement (RLM) and Steam Moves.
 */
export interface SharpInput {
  lineMovement: number;
  publicBetPercentage: number;
  betPercentageOnFavorite?: number | null;
  sportKey?: string;
}

export function estimateSharpMoney({ 
  lineMovement, 
  publicBetPercentage, 
  betPercentageOnFavorite = null,
  sportKey = 'americanfootball_nfl'
}: SharpInput): number {
  let score = 50;

  // Normalization factor for movement based on sport (e.g. 1pt in NFL is bigger than 1pt in NBA)
  const movementSensitivity = sportKey.includes('basketball') ? 0.3 : 1.0;
  const tMovement = lineMovement * movementSensitivity;

  // Strong Reverse Line Movement = Sharp money indicator
  // Logic: Public likes favorite (>65%) but line moves towards underdog (negative movement)
  if (publicBetPercentage > 65 && lineMovement < -0.5) {
    score = 82 + Math.abs(lineMovement) * 10;
  } 
  // Public likes dog (<35%) but line moves towards favorite (positive movement)
  else if (publicBetPercentage < 35 && lineMovement > 0.5) {
    score = 78 + lineMovement * 8;
  }

  // Big line movement (steam move) indicating professional limit bets
  if (Math.abs(lineMovement) > 2) {
    score = Math.max(score, 75);
  }

  // Heavy imbalance in betting percentage (volume based)
  if (betPercentageOnFavorite && Math.abs(betPercentageOnFavorite - 50) > 25) {
    score += 8;
  }

  return Math.min(95, Math.max(45, Math.round(score)));
}
