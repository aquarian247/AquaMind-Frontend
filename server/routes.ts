import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAlertSchema, insertFarmSiteSchema, insertPenSchema, insertWaterQualityReadingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard endpoints
  app.get("/api/dashboard/kpis", async (req, res) => {
    try {
      const kpis = await storage.getDashboardKPIs();
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard KPIs" });
    }
  });

  app.get("/api/dashboard/farm-sites", async (req, res) => {
    try {
      const farmSites = await storage.getFarmSites();
      res.json(farmSites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch farm sites" });
    }
  });

  app.get("/api/dashboard/alerts", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const alerts = await storage.getActiveAlerts();
      res.json(alerts.slice(0, limit));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  // Farm Sites endpoints
  app.get("/api/farm-sites", async (req, res) => {
    try {
      const farmSites = await storage.getFarmSites();
      res.json(farmSites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch farm sites" });
    }
  });

  app.get("/api/farm-sites/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const farmSite = await storage.getFarmSite(id);
      if (!farmSite) {
        return res.status(404).json({ error: "Farm site not found" });
      }
      res.json(farmSite);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch farm site" });
    }
  });

  app.post("/api/farm-sites", async (req, res) => {
    try {
      const validatedData = insertFarmSiteSchema.parse(req.body);
      const farmSite = await storage.createFarmSite(validatedData);
      res.status(201).json(farmSite);
    } catch (error) {
      res.status(400).json({ error: "Invalid farm site data" });
    }
  });

  // Pens endpoints
  app.get("/api/farm-sites/:farmSiteId/pens", async (req, res) => {
    try {
      const farmSiteId = parseInt(req.params.farmSiteId);
      const pens = await storage.getPensByFarmSite(farmSiteId);
      res.json(pens);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pens" });
    }
  });

  app.get("/api/pens/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pen = await storage.getPen(id);
      if (!pen) {
        return res.status(404).json({ error: "Pen not found" });
      }
      res.json(pen);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pen" });
    }
  });

  app.post("/api/pens", async (req, res) => {
    try {
      const validatedData = insertPenSchema.parse(req.body);
      const pen = await storage.createPen(validatedData);
      res.status(201).json(pen);
    } catch (error) {
      res.status(400).json({ error: "Invalid pen data" });
    }
  });

  // Water Quality endpoints
  app.get("/api/farm-sites/:farmSiteId/water-quality", async (req, res) => {
    try {
      const farmSiteId = parseInt(req.params.farmSiteId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const readings = await storage.getWaterQualityReadings(farmSiteId, limit);
      res.json(readings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch water quality readings" });
    }
  });

  app.post("/api/water-quality", async (req, res) => {
    try {
      const validatedData = insertWaterQualityReadingSchema.parse(req.body);
      const reading = await storage.createWaterQualityReading(validatedData);
      res.status(201).json(reading);
    } catch (error) {
      res.status(400).json({ error: "Invalid water quality data" });
    }
  });

  // Fish Health endpoints
  app.get("/api/pens/:penId/fish-health", async (req, res) => {
    try {
      const penId = parseInt(req.params.penId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const records = await storage.getFishHealthRecords(penId, limit);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fish health records" });
    }
  });

  // Feeding endpoints
  app.get("/api/pens/:penId/feeding", async (req, res) => {
    try {
      const penId = parseInt(req.params.penId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const records = await storage.getFeedingRecords(penId, limit);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feeding records" });
    }
  });

  // Alerts endpoints
  app.get("/api/alerts", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activeOnly = req.query.active === 'true';
      
      let alerts;
      if (activeOnly) {
        alerts = await storage.getActiveAlerts();
      } else {
        alerts = await storage.getAlerts(limit);
      }
      
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ error: "Invalid alert data" });
    }
  });

  app.patch("/api/alerts/:id/resolve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const alert = await storage.resolveAlert(id);
      res.json(alert);
    } catch (error) {
      res.status(404).json({ error: "Alert not found" });
    }
  });

  // System Metrics endpoints
  app.get("/api/metrics", async (req, res) => {
    try {
      const metricType = req.query.type as string;
      const farmSiteId = req.query.farmSiteId ? parseInt(req.query.farmSiteId as string) : undefined;
      const metrics = await storage.getSystemMetrics(metricType, farmSiteId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch system metrics" });
    }
  });

  // Chart data endpoints for dashboard
  app.get("/api/charts/water-quality", async (req, res) => {
    try {
      const farmSiteId = parseInt(req.query.farmSiteId as string) || 1;
      const readings = await storage.getWaterQualityReadings(farmSiteId, 7);
      
      // Transform data for Chart.js
      const chartData = {
        labels: readings.reverse().map(reading => 
          reading.timestamp.toLocaleDateString('en-US', { weekday: 'short' })
        ),
        datasets: [
          {
            label: 'Temperature (°C)',
            data: readings.map(r => parseFloat(r.temperature)),
            borderColor: '#1976D2',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
          },
          {
            label: 'Dissolved O2 (mg/L)',
            data: readings.map(r => parseFloat(r.dissolvedOxygen)),
            borderColor: '#00ACC1',
            backgroundColor: 'rgba(0, 172, 193, 0.1)',
          },
          {
            label: 'pH Level',
            data: readings.map(r => parseFloat(r.phLevel)),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
          }
        ]
      };
      
      res.json(chartData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch water quality chart data" });
    }
  });

  app.get("/api/charts/fish-growth", async (req, res) => {
    try {
      // Mock fish growth data - in real app would come from fish health records
      const chartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
        datasets: [
          {
            label: 'Average Weight (kg)',
            data: [2.1, 2.3, 2.5, 2.8, 3.1, 3.4, 3.7],
            backgroundColor: 'rgba(25, 118, 210, 0.8)',
            borderColor: '#1976D2',
          }
        ]
      };
      
      res.json(chartData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fish growth chart data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
