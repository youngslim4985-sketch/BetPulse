import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { marketStateBus } from "./services/marketState";
import { startIngestionPipeline } from "./services/ingestionPipeline";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Data Ops
  startIngestionPipeline();

  app.use(express.json());

  // API Routes
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
