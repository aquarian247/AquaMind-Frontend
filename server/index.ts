import express, { type Request, Response, NextFunction } from "express";
import { createServer as createHttpServer } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { registerMockApiRoutes, shouldUseMockApi } from "./mock-api";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Decide which API backend to use
  if (shouldUseMockApi()) {
    log("🔌 Using MOCK API (Express in-process)");
    registerMockApiRoutes(app);
  } else {
    const target = process.env.DJANGO_API_URL || "http://localhost:8000";
    log(`🔀 Proxying API requests to Django backend at ${target}`);
    app.use(
      "/api",
      createProxyMiddleware({
        target,
        changeOrigin: true,
        // keep original path (/api/…) unchanged
        pathRewrite: { "^/api": "/api" },
      })
    );
  }

  // Create HTTP server (previously returned by registerRoutes)
  const server = createHttpServer(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  // Prefer an explicit PORT env-var; otherwise fall back to 5001
  const port = Number(process.env.PORT) || 5001;
  server.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
    log(`serving on port ${port}`);
    }
  );
})();
