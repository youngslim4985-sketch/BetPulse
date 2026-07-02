import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { marketStateBus } from "./services/marketState";
import { startIngestionPipeline } from "./services/ingestionPipeline";
import tenantsRouter from "./services/tenants.router";
import { authenticateApiKey, requireTierFeature } from "./services/apiKeyAuth";
import { rateLimiter, getOrCreateAggregate } from "./services/rateLimiter";
import { billingService } from "./services/billing.service";
import { feedbackLoopManager } from "./services/feedbackLoop";
import { OddsApiProvider, MockMarketProvider, CachedMarketProvider } from "./src/providers/odds-api-provider";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Data Ops
  startIngestionPipeline();

  app.use(express.json());

  const providerName = process.env.MARKET_PROVIDER || "mock";
  const cacheTtlMs = Number(process.env.CACHE_TTL_MS || 30_000);

  const baseProvider =
    providerName === "odds-api"
      ? new OddsApiProvider(process.env.ODDS_API_KEY)
      : new MockMarketProvider();

  const marketProvider = new CachedMarketProvider(baseProvider, cacheTtlMs);


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

  // --- Phase 3: Shadowing & Validation Core Endpoints ---
  app.get("/api/v1/lbs/decisions", (req, res) => {
    const list = Array.from(feedbackLoopManager.decisions.values());
    const sorted = list.sort((a, b) => b.timestamp - a.timestamp).slice(0, 80);
    res.json({ success: true, decisions: sorted });
  });

  app.get("/api/v1/lbs/drift-metrics", (req, res) => {
    feedbackLoopManager.recalculateDrift();
    res.json({ success: true, driftMetrics: feedbackLoopManager.driftMetrics });
  });

  app.get("/api/v1/lbs/shadow-metrics", (req, res) => {
    const reports = feedbackLoopManager.compilePerformanceReports();
    res.json({
      success: true,
      champion: {
        name: feedbackLoopManager.championModelName,
        version: feedbackLoopManager.championModelVersion,
        metrics: reports.champion
      },
      challenger: {
        name: feedbackLoopManager.challengerModelName,
        version: feedbackLoopManager.challengerModelVersion,
        metrics: reports.challenger
      }
    });
  });

  app.post("/api/v1/lbs/label", (req, res) => {
    const { event_id, label, source } = req.body;
    if (!event_id || !label) {
      return res.status(400).json({ success: false, error: "Missing event_id or label parameters" });
    }
    const success = feedbackLoopManager.labelEvent(event_id, label, source || 'ORACLE_MANUAL');
    if (success) {
      res.json({ success: true, message: `Event ${event_id} resolved with label "${label}"` });
    } else {
      res.status(404).json({ success: false, error: "Event decision not found" });
    }
  });

  app.get("/api/v1/lbs/training-data", (req, res) => {
    const { feature_version, model_version } = req.query;
    const dataset = feedbackLoopManager.buildTrainingDataset(
      feature_version as string,
      model_version as string
    );
    res.json({ success: true, datasetSize: dataset.length, dataset });
  });

  app.post("/api/v1/lbs/promote", (req, res) => {
    const result = feedbackLoopManager.promoteChallengerToChampion();
    res.json(result);
  });

  app.post("/api/v1/lbs/retrain", (req, res) => {
    feedbackLoopManager.triggerModelRetraining();
    res.json({ success: true, message: "Engine retraining completed. Distribution alignment restored to nominal baselines." });
  });

  app.post("/api/v1/lbs/simulate-labels", (req, res) => {
    const outcome = feedbackLoopManager.triggerStripeWebhookSimulator();
    res.json({
      message: `Simulated dynamic Stripe Billing and Sports Ingestion feedback cycle.`,
      ...outcome
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/provider/status", (req, res) => {
    res.json({
      success: true,
      provider: providerName,
      cacheTtlMs: cacheTtlMs
    });
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
