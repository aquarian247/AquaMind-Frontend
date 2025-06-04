import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAlertSchema, insertFarmSiteSchema, 
  insertEnvironmentalParameterSchema, insertEnvironmentalReadingSchema,
  insertContainerSchema, insertBatchSchema, insertFeedTypeSchema,
  insertFeedingEventSchema, insertHealthRecordSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Django API v1 endpoints - Environmental
  app.get("/api/v1/environmental/parameters/", async (req, res) => {
    try {
      const parameters = await storage.getEnvironmentalParameters();
      res.json({
        count: parameters.length,
        next: null,
        previous: null,
        results: parameters
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch environmental parameters" });
    }
  });

  app.post("/api/v1/environmental/parameters/", async (req, res) => {
    try {
      const validatedData = insertEnvironmentalParameterSchema.parse(req.body);
      const parameter = await storage.createEnvironmentalParameter(validatedData);
      res.status(201).json(parameter);
    } catch (error) {
      res.status(400).json({ error: "Invalid environmental parameter data" });
    }
  });

  app.get("/api/v1/environmental/readings/", async (req, res) => {
    try {
      const containerId = req.query.container ? parseInt(req.query.container as string) : undefined;
      const parameterId = req.query.parameter ? parseInt(req.query.parameter as string) : undefined;
      const readings = await storage.getEnvironmentalReadings(containerId, parameterId);
      res.json({
        count: readings.length,
        next: null,
        previous: null,
        results: readings
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch environmental readings" });
    }
  });

  app.post("/api/v1/environmental/readings/", async (req, res) => {
    try {
      const validatedData = insertEnvironmentalReadingSchema.parse(req.body);
      const reading = await storage.createEnvironmentalReading(validatedData);
      res.status(201).json(reading);
    } catch (error) {
      res.status(400).json({ error: "Invalid environmental reading data" });
    }
  });

  // Django API v1 endpoints - Containers and Batches
  app.get("/api/v1/containers/", async (req, res) => {
    try {
      const containers = await storage.getContainers();
      res.json({
        count: containers.length,
        next: null,
        previous: null,
        results: containers
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch containers" });
    }
  });

  app.get("/api/v1/batch/batches/", async (req, res) => {
    try {
      const batches = await storage.getBatches();
      res.json({
        count: batches.length,
        next: null,
        previous: null,
        results: batches
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch batches" });
    }
  });

  app.post("/api/v1/batch/batches/", async (req, res) => {
    try {
      const validatedData = insertBatchSchema.parse(req.body);
      const batch = await storage.createBatch(validatedData);
      res.status(201).json(batch);
    } catch (error) {
      res.status(400).json({ error: "Invalid batch data" });
    }
  });

  // Django API v1 endpoints - Feed Management
  app.get("/api/v1/inventory/feed-types/", async (req, res) => {
    try {
      const feedTypes = await storage.getFeedTypes();
      res.json({
        count: feedTypes.length,
        next: null,
        previous: null,
        results: feedTypes
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feed types" });
    }
  });

  app.get("/api/v1/inventory/feeding-events/", async (req, res) => {
    try {
      const events = await storage.getFeedingEvents();
      res.json({
        count: events.length,
        next: null,
        previous: null,
        results: events
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feeding events" });
    }
  });

  app.post("/api/v1/inventory/feeding-events/", async (req, res) => {
    try {
      const validatedData = insertFeedingEventSchema.parse(req.body);
      const event = await storage.createFeedingEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid feeding event data" });
    }
  });

  // Django API v1 endpoints - Health Records
  app.get("/api/v1/health/records/", async (req, res) => {
    try {
      const records = await storage.getHealthRecords();
      res.json({
        count: records.length,
        next: null,
        previous: null,
        results: records
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch health records" });
    }
  });

  app.post("/api/v1/health/records/", async (req, res) => {
    try {
      const validatedData = insertHealthRecordSchema.parse(req.body);
      const record = await storage.createHealthRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ error: "Invalid health record data" });
    }
  });

  // Legacy Dashboard endpoints for current frontend
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

  // Chart data endpoints for dashboard using Django API data
  app.get("/api/charts/water-quality", async (req, res) => {
    try {
      const containerId = parseInt(req.query.farmSiteId as string) || 1;
      
      // Get temperature readings
      const tempParam = (await storage.getEnvironmentalParameters())
        .find(p => p.name === "Water Temperature");
      const oxygenParam = (await storage.getEnvironmentalParameters())
        .find(p => p.name === "Dissolved Oxygen");
      const phParam = (await storage.getEnvironmentalParameters())
        .find(p => p.name === "pH Level");
      
      if (!tempParam || !oxygenParam || !phParam) {
        return res.status(500).json({ error: "Environmental parameters not found" });
      }

      const tempReadings = await storage.getEnvironmentalReadings(containerId, tempParam.id);
      const oxygenReadings = await storage.getEnvironmentalReadings(containerId, oxygenParam.id);
      const phReadings = await storage.getEnvironmentalReadings(containerId, phParam.id);
      
      // Take last 7 readings and reverse for chronological order
      const recentTempReadings = tempReadings.slice(0, 7).reverse();
      const recentOxygenReadings = oxygenReadings.slice(0, 7).reverse();
      const recentPhReadings = phReadings.slice(0, 7).reverse();
      
      // Transform data for Chart.js
      const chartData = {
        labels: recentTempReadings.map(reading => 
          reading.readingTime.toLocaleDateString('en-US', { weekday: 'short' })
        ),
        datasets: [
          {
            label: 'Temperature (°C)',
            data: recentTempReadings.map(r => parseFloat(r.value)),
            borderColor: '#1976D2',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
          },
          {
            label: 'Dissolved O2 (mg/L)',
            data: recentOxygenReadings.map(r => parseFloat(r.value)),
            borderColor: '#00ACC1',
            backgroundColor: 'rgba(0, 172, 193, 0.1)',
          },
          {
            label: 'pH Level',
            data: recentPhReadings.map(r => parseFloat(r.value)),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
          }
        ]
      };
      
      res.json(chartData);
    } catch (error) {
      console.error("Water quality chart error:", error);
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
