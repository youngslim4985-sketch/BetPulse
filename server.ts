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
    res.json({
      status: "HEALTHY",
      brand: "Line Breaker™",
      component: "v4.2 PROJECTION_WORKER",
      stats: marketStateBus.getStats(),
      checkpoints: [
        { name: "L1_CACHE", status: "SYNCED" },
        { name: "LUA_CAS_ENGINE", status: "READY" },
        { name: "BLOOM_FILTER", status: "OPERATIONAL" }
      ]
    });
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
