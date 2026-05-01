export interface PerformanceStats {
  total_picks: number;
  wins: number;
  losses: number;
  pushes: number;
  win_percentage: number;
  avg_score: number;
}

export function getHistoricalStats(minScore: number = 0): PerformanceStats {
  // Simulating historical data based on the Momentum Edge logic
  // In a real app, this queries the 'pick_performance' table
  
  if (minScore >= 75) {
    return {
      total_picks: 142,
      wins: 84,
      losses: 52,
      pushes: 6,
      win_percentage: 61.8,
      avg_score: 82.4
    };
  }
  
  return {
    total_picks: 1204,
    wins: 624,
    losses: 540,
    pushes: 40,
    win_percentage: 53.6,
    avg_score: 64.2
  };
}
