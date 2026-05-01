import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { calculateMomentumEdgeScore } from "./services/momentumEdgeScore.ts";
import { getAlphaInsights } from "./services/geminiService.ts";
import { getHistoricalStats } from "./services/performanceService.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Enhanced Mock data with realistic daily schedule
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getRelativeDate = (days: number, hours: number = 0) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    d.setHours(hours, 0, 0, 0);
    return d.toISOString();
  };

  const mockGames = [
    // --- TODAY ---
    {
      id: "nfl-today-1",
      sport_key: "americanfootball_nfl",
      status: "live",
      home_team: "Kansas City Chiefs",
      home_score: 24,
      away_team: "Baltimore Ravens",
      away_score: 21,
      period: "Q4",
      clock: "8:42",
      commence_time: getRelativeDate(0, 13), // 1 PM Today
      spread: -3,
      line_movement: -0.5,
      public_betting_pct: 65,
      momentum_edge: 80,
      matchup_rating: 85,
    },
    {
      id: "nba-today-1",
      sport_key: "basketball_nba",
      status: "live",
      home_team: "LA Lakers",
      home_score: 102,
      away_team: "Boston Celtics",
      away_score: 105,
      period: "Q4",
      clock: "2:15",
      commence_time: getRelativeDate(0, 19), // 7 PM Today
      spread: -2.5,
      line_movement: -2.0,
      public_betting_pct: 48,
      momentum_edge: 92,
      matchup_rating: 92,
    },
    {
      id: "soccer-today-1",
      sport_key: "soccer_epl",
      status: "live",
      home_team: "Manchester City",
      home_score: 2,
      away_team: "Liverpool",
      away_score: 1,
      period: "65'",
      clock: "65:00",
      commence_time: getRelativeDate(0, 11), // 11 AM Today
      spread: -0.75,
      line_movement: -0.25,
      public_betting_pct: 60,
      momentum_edge: 85,
      matchup_rating: 95,
    },
    {
      id: "mlb-today-1",
      sport_key: "baseball_mlb",
      status: "upcoming",
      home_team: "NY Yankees",
      away_team: "Boston Red Sox",
      commence_time: getRelativeDate(0, 20), // 8 PM Today
      spread: 1.5,
      line_movement: 0.2,
      public_betting_pct: 55,
      momentum_edge: 70,
      matchup_rating: 75,
    },
    // --- TOMORROW ---
    {
      id: "nfl-tomorrow-1",
      sport_key: "americanfootball_nfl",
      status: "upcoming",
      home_team: "San Francisco 49ers",
      away_team: "New York Jets",
      commence_time: getRelativeDate(1, 19), 
      spread: -4.5,
      line_movement: 1.0,
      public_betting_pct: 72, 
      momentum_edge: 45,
      matchup_rating: 90,
    },
    {
      id: "nba-tomorrow-1",
      sport_key: "basketball_nba",
      status: "upcoming",
      home_team: "Milwaukee Bucks",
      away_team: "Denver Nuggets",
      commence_time: getRelativeDate(1, 20),
      spread: -1.5,
      line_movement: -0.5,
      public_betting_pct: 52,
      momentum_edge: 78,
      matchup_rating: 88,
    },
    // --- DAY AFTER ---
    {
      id: "nfl-day-after",
      sport_key: "americanfootball_nfl",
      status: "upcoming",
      home_team: "Buffalo Bills",
      away_team: "Miami Dolphins",
      commence_time: getRelativeDate(2, 13),
      spread: -2,
      line_movement: -1.5,
      public_betting_pct: 58,
      momentum_edge: 82,
      matchup_rating: 84,
    }
  ];

  // API Routes
  app.get("/api/games", (req, res) => {
    const sport = req.query.sport as string;
    
    let filteredGames = mockGames;
    if (sport && sport !== 'all') {
      filteredGames = mockGames.filter(g => g.sport_key === sport || g.sport_key.startsWith(sport));
    }

    const gamesWithScores = filteredGames.map(game => ({
      ...game,
      alpha_score: calculateMomentumEdgeScore({
        sportKey: game.sport_key,
        lineMovement: game.line_movement,
        publicPercentage: game.public_betting_pct,
        matchupRating: game.matchup_rating,
        momentumEdge: game.momentum_edge
      }),
      sharp_money_indicator: 0.75 
    }));
    res.json(gamesWithScores);
  });

  app.get("/api/insights/:gameId", async (req, res) => {
    const game = mockGames.find(g => g.id === req.params.gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });
    
    const alpha_score = calculateMomentumEdgeScore({
      sportKey: game.sport_key,
      lineMovement: game.line_movement,
      publicPercentage: game.public_betting_pct,
      matchupRating: game.matchup_rating,
      momentumEdge: game.momentum_edge
    });

    const insights = await getAlphaInsights({ ...game, alpha_score });
    res.json({ insights });
  });

  app.get("/api/stats", (req, res) => {
    const overall = getHistoricalStats(0);
    const highConfidence = getHistoricalStats(75);
    res.json({
      success: true,
      overall,
      highConfidence,
      lastUpdated: new Date().toISOString()
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
