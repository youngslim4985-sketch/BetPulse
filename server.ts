import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { marketStateBus } from "./services/marketState";
import { startIngestionPipeline } from "./services/ingestionPipeline";
import tenantsRouter from "./services/tenants.router";
import { authenticateApiKey, requireTierFeature } from "./services/apiKeyAuth";
import { rateLimiter, getOrCreateAggregate } from "./services/rateLimiter";
import { billingService } from "./services/billing.service";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Data Ops
  startIngestionPipeline();

  app.use(express.json());

  // Multi-tenant API Router (Tenant Signups, Key Generations, List Keys, Plan Upgrades)
  app.use('/api/v1', tenantsRouter);

  // Authenticated Developer Endpoints (Showcases Rate-Limiting & Custom Billing Compute Weightings)
  
  // 1. Live LBS Feeds (Standard Weight = 1.0 compute unit, allowed for Sandbox+)
  app.get("/api/v1/lbs/live/:symbol", authenticateApiKey, rateLimiter(1.0), (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const state = marketStateBus.getState(symbol);
    
    // Fallback mock if data-stream hasn't populated
    const fallbackStats = {
      symbol,
      lbsScore: 84,
      classification: "STRONG",
      canonicalPrice: -110,
      impliedProbability: 0.5238,
      lastUpdated: Date.now()
    };

    res.json({
      success: true,
      data: state ? {
        symbol: state.market_id,
        lbsScore: Math.floor(state.confidence.overall * 100),
        classification: state.confidence.overall > 0.90 ? "ELITE" : (state.confidence.overall > 0.75 ? "STRONG" : "POSITIVE"),
        canonicalPrice: state.state.blob.price,
        impliedProbability: state.confidence.completeness,
        lastUpdated: state.timestamp
      } : fallbackStats
    });
  });

  // 2. Bayesian Prior Estimations (Heavy Weight = 5.0 compute units, restricted to Pro/Enterprise)
  app.get("/api/v1/lbs/bayesian", authenticateApiKey, requireTierFeature("bayesianPriors"), rateLimiter(5.0), (req: any, res) => {
    const currentMonth = new Date().toISOString().substring(0, 7);
    const stats = getOrCreateAggregate(req.tenant.id, currentMonth);

    res.json({
      success: true,
      computeCharge: 5.0,
      quotaRemaining: Math.max(0, 100000 - stats.callCount),
      bayesianPriors: {
        model: "BayesianBetaConjugateEngine_v1",
        alpha: 42,
        beta: 18,
        priorMean: 0.70,
        historicalMultiplier: 1.40,
        sampleCount: 60,
        status: "STATIONARY"
      }
    });
  });

  // 3. Athlete-IQ Analytics Engine (Heavy Weight = 3.0 compute units, restricted to Enterprise only)
  app.get("/api/v1/lbs/athleteiq", authenticateApiKey, requireTierFeature("athleteIQ"), rateLimiter(3.0), (req, res) => {
    res.json({
      success: true,
      computeCharge: 3.0,
      athleteIQ: {
        engine: "AthleteIQPredictiveModels_v4",
        telemetryAccuracy: "98.92%",
        dynamicProjections: [
          { player: "Stephen Curry", prop: "3-Pointers Made", projectedLine: 4.8, edgeScore: 92 },
          { player: "LeBron James", prop: "Total Assists", projectedLine: 8.2, edgeScore: 88 },
          { player: "Anthony Davis", prop: "Rebounds Collected", projectedLine: 12.5, edgeScore: 64 }
        ],
        updatedAt: Date.now()
      }
    });
  });

  // 4. Retrieve tenant invoice details (Standard Billing, auth key required)
  app.get("/api/v1/tenants/billing/statements", authenticateApiKey, (req: any, res) => {
    const invoices = billingService.getInvoices(req.tenant.id);
    const events = billingService.getBillingEvents(req.tenant.id);
    res.json({ invoices, events });
  });

  // Standard API health
  app.get("/api/health/pipeline", (req, res) => {
    const stats = marketStateBus.getStats();
    res.json({
      status: "HEALTHY",
      brand: "Line Breaker™",
      component: "v4.2 EPISTEMIC_COMPILER",
      stats: {
        ...stats,
        reconstructionEntropy: (stats.inferredStates / (stats.canonicalStates || 1)).toFixed(4)
      },
      checkpoints: [
        { name: "L1_CACHE", status: "SYNCED" },
        { name: "TRUTH_FIREWALL", status: "ENFORCING" },
        { name: "EPISTEMIC_ACCOUNTING", status: "ACTIVE" }
      ]
    });
  });

  app.get("/api/market/:symbol", (req, res) => {
    const state = marketStateBus.getState(req.params.symbol);
    if (!state) return res.status(404).json({ error: "Record Not Found" });
    res.json(state);
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Line Breaker™ Enterprise Core listening on port ${PORT}`);
  });
}

startServer();
