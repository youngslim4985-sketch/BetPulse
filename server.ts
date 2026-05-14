import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { calculateMomentumEdgeScore } from "./services/momentumEdgeScore.ts";
import { calculatePlayerPropEdge } from "./services/playerPropsEdge.ts";
import { calculateEdgeFactor } from "./services/edgeFactor.ts";
import { generateGameIQInsights } from "./services/insightEngine.ts";
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
    // --- NBA PLAYOFFS (MAY 1, 2026) ---
    {
      id: "nba-playoffs-1",
      sport_key: "basketball_nba",
      status: "live",
      home_team: "Boston Celtics",
      home_score: 94,
      away_team: "Miami Heat",
      away_score: 88,
      period: "Q3",
      clock: "4:22",
      commence_time: getRelativeDate(0, 19), 
      spread: -8.5,
      line_movement: -1.5,
      public_betting_pct: 78,
      matchup_rating: 98,
      edge_inputs: {
        injuryImpact: 85,
        weatherImpact: 0,
        travelFatigue: 20,
        recentForm: 75,
        modelSignal: 95
      }
    },
    {
      id: "nba-playoffs-2",
      sport_key: "basketball_nba",
      status: "upcoming",
      home_team: "Denver Nuggets",
      away_team: "Phoenix Suns",
      commence_time: getRelativeDate(0, 21), 
      spread: -4.5,
      line_movement: 0.5,
      public_betting_pct: 42,
      matchup_rating: 96,
      edge_inputs: {
        injuryImpact: 10,
        weatherImpact: 0,
        travelFatigue: 5,
        recentForm: 82,
        modelSignal: 88
      }
    },

    // --- MLB REGULAR SEASON ---
    {
      id: "mlb-today-1",
      sport_key: "baseball_mlb",
      status: "live",
      home_team: "NY Yankees",
      home_score: 4,
      away_team: "Toronto Blue Jays",
      away_score: 2,
      period: "Top 7th",
      clock: "1 Out",
      commence_time: getRelativeDate(0, 13), 
      spread: -1.5,
      line_movement: 0.2,
      public_betting_pct: 62,
      matchup_rating: 82,
      edge_inputs: {
        injuryImpact: 5,
        weatherImpact: 40,
        travelFatigue: 15,
        recentForm: 60,
        modelSignal: 65
      }
    },
    {
      id: "mlb-today-2",
      sport_key: "baseball_mlb",
      status: "upcoming",
      home_team: "LA Dodgers",
      away_team: "SF Giants",
      commence_time: getRelativeDate(0, 19), 
      spread: -1.5,
      line_movement: -0.5,
      public_betting_pct: 88,
      matchup_rating: 90,
      edge_inputs: {
        injuryImpact: 15,
        weatherImpact: 10,
        travelFatigue: 60,
        recentForm: 92,
        modelSignal: 90
      }
    },

    // --- ELITE SOCCER ---
    {
      id: "soccer-cl-1",
      sport_key: "soccer_uefa_champions_league",
      status: "live",
      home_team: "Real Madrid",
      home_score: 2,
      away_team: "Manchester City",
      away_score: 2,
      period: "82'",
      clock: "82:14",
      commence_time: getRelativeDate(0, 11), 
      spread: 0,
      line_movement: -0.25,
      public_betting_pct: 55,
      matchup_rating: 99,
      edge_inputs: {
        injuryImpact: 0,
        weatherImpact: 0,
        travelFatigue: 10,
        recentForm: 98,
        modelSignal: 95
      }
    },

    // --- TOMORROW ---
    {
      id: "nba-tomorrow-1",
      sport_key: "basketball_nba",
      status: "upcoming",
      home_team: "Philadelphia 76ers",
      away_team: "NY Knicks",
      commence_time: getRelativeDate(1, 19), 
      spread: -2,
      line_movement: -1.0,
      public_betting_pct: 45,
      matchup_rating: 94,
      edge_inputs: {
        injuryImpact: 70,
        weatherImpact: 0,
        travelFatigue: 20,
        recentForm: 85,
        modelSignal: 92
      }
    },
    {
      id: "mlb-tomorrow-1",
      sport_key: "baseball_mlb",
      status: "upcoming",
      home_team: "Chicago Cubs",
      away_team: "St. Louis Cardinals",
      commence_time: getRelativeDate(1, 14),
      spread: 1.5,
      line_movement: 0.5,
      public_betting_pct: 50,
      matchup_rating: 80,
      edge_inputs: {
        injuryImpact: 0,
        weatherImpact: 60,
        travelFatigue: 5,
        recentForm: 75,
        modelSignal: 80
      }
    }
  ];

  // Mock Player Props Data
  const mockPlayerProps = [
    {
      id: "prop-1",
      game_id: "nba-playoffs-1",
      player_name: "Jayson Tatum",
      team: "Boston Celtics",
      prop_type: "Points",
      line_value: 27.5,
      over_odds: -115,
      under_odds: -105,
      projected_value: 31.2,
      recent_avg: 28.5,
      recent_trend: 1.2,
    },
    {
      id: "prop-2",
      game_id: "nba-playoffs-1",
      player_name: "Jimmy Butler",
      team: "Miami Heat",
      prop_type: "Rebounds",
      line_value: 6.5,
      over_odds: 105,
      under_odds: -125,
      projected_value: 8.4,
      recent_avg: 7.2,
      recent_trend: 0.8,
    },
    {
      id: "prop-3",
      game_id: "mlb-today-1",
      player_name: "Gerrit Cole",
      team: "NY Yankees",
      prop_type: "Strikeouts",
      line_value: 7.5,
      over_odds: -110,
      under_odds: -110,
      projected_value: 9.1,
      recent_avg: 8.2,
      recent_trend: 0.5,
    },
    {
      id: "prop-4",
      game_id: "soccer-cl-1",
      player_name: "Erling Haaland",
      team: "Manchester City",
      prop_type: "Anytime Goalscorer",
      line_value: 0.5,
      over_odds: -140,
      under_odds: 110,
      projected_value: 0.85,
      recent_avg: 0.8,
      recent_trend: 0.2,
    }
  ];

  // API Routes
  app.post("/api/analyze", async (req, res) => {
    const { gameId } = req.body;
    const game = mockGames.find(g => g.id === gameId);
    
    if (!game) return res.status(404).json({ error: "Game not found" });

    const momentumEdge = calculateEdgeFactor(game.edge_inputs || {});
    const alphaScore = calculateMomentumEdgeScore({
      lineMovement: game.line_movement,
      publicPercentage: game.public_betting_pct,
      matchupRating: game.matchup_rating,
      momentumEdge: momentumEdge
    });

    // Mock Monetization Limit
    const isPro = req.headers['x-user-tier'] === 'pro';

    const structuredInsights = isPro ? generateGameIQInsights({
      lineMovement: game.line_movement,
      sharpPercentage: 75,
      publicPercentage: game.public_betting_pct,
      matchupRating: game.matchup_rating,
      edgeFactor: momentumEdge
    }) : ["Upgrade to EdgePulse PRO to unlock detailed market intelligence and proprietary sharp indicators."];

    // Get AI Verdict from Gemini
    const aiVerdict = await getAlphaInsights({ ...game, alpha_score: alphaScore });

    res.json({
      success: true,
      data: {
        game: `${game.away_team} @ ${game.home_team}`,
        alphaScore,
        momentumEdge,
        lineMovement: game.line_movement,
        publicPercentage: game.public_betting_pct,
        matchupRating: game.matchup_rating,
        structuredInsights,
        aiVerdict,
        isPro,
        market_version: `v4.2.${Math.floor(Date.now() / 100000)}`,
        ingestion_latency: "42ms"
      }
    });
  });

  app.get("/api/player-props", (req, res) => {
    const sport = req.query.sport as string;
    
    // In a real app, we'd filter props by game/sport
    const propsWithScores = mockPlayerProps.map(prop => {
      const game = mockGames.find(g => g.id === prop.game_id);
      return {
        ...prop,
        edge_score: calculatePlayerPropEdge({
          sportKey: game?.sport_key || 'basketball_nba',
          propType: prop.prop_type,
          lineValue: prop.line_value,
          projectedValue: prop.projected_value,
          overOdds: prop.over_odds,
          underOdds: prop.under_odds,
          recentAvg: prop.recent_avg,
          recentTrend: prop.recent_trend
        })
      };
    }).sort((a, b) => b.edge_score - a.edge_score);

    res.json(propsWithScores);
  });

  app.get("/api/games", (req, res) => {
    const sport = req.query.sport as string;
    
    let filteredGames = mockGames;
    if (sport && sport !== 'all') {
      filteredGames = mockGames.filter(g => g.sport_key === sport || g.sport_key.startsWith(sport));
    }

    const gamesWithScores = filteredGames.map(game => {
      const momentumEdge = calculateEdgeFactor(game.edge_inputs || {});
      
      return {
        ...game,
        momentum_edge: momentumEdge,
        alpha_score: calculateMomentumEdgeScore({
          sportKey: game.sport_key,
          lineMovement: game.line_movement,
          publicPercentage: game.public_betting_pct,
          matchupRating: game.matchup_rating,
          momentumEdge: momentumEdge
        }),
        sharp_money_indicator: 0.75 
      };
    });
    res.json(gamesWithScores);
  });

  app.get("/api/insights/:gameId", async (req, res) => {
    const game = mockGames.find(g => g.id === req.params.gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });
    
    const momentumEdge = calculateEdgeFactor(game.edge_inputs || {});
    const alpha_score = calculateMomentumEdgeScore({
      sportKey: game.sport_key,
      lineMovement: game.line_movement,
      publicPercentage: game.public_betting_pct,
      matchupRating: game.matchup_rating,
      momentumEdge: momentumEdge
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
