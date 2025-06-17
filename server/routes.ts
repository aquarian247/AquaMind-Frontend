import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAlertSchema, insertFarmSiteSchema, insertPenSchema,
  insertEnvironmentalParameterSchema, insertEnvironmentalReadingSchema,
  insertContainerSchema, insertBatchSchema, insertFeedTypeSchema,
  insertFeedingEventSchema, insertHealthRecordSchema,
  insertFeedPurchaseSchema, insertFeedContainerSchema, insertFeedContainerStockSchema,
  insertBatchFeedingSummarySchema, insertSpeciesSchema, insertStageSchema,
  insertLabSampleSchema, insertHealthAssessmentSchema, insertWeatherDataSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Batch Management endpoints
  app.get("/api/batches", async (req, res) => {
    try {
      const batches = await storage.getBatches();
      res.json(batches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch batches" });
    }
  });

  app.post("/api/batches", async (req, res) => {
    try {
      const validatedData = insertBatchSchema.parse(req.body);
      const batch = await storage.createBatch(validatedData);
      res.status(201).json(batch);
    } catch (error) {
      res.status(400).json({ error: "Invalid batch data" });
    }
  });

  app.get("/api/species", async (req, res) => {
    try {
      const species = await storage.getSpecies();
      res.json(species);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch species" });
    }
  });

  app.get("/api/stages", async (req, res) => {
    try {
      const stages = await storage.getStages();
      res.json(stages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stages" });
    }
  });

  app.get("/api/containers", async (req, res) => {
    try {
      const containers = await storage.getContainers();
      res.json(containers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch containers" });
    }
  });

  // Health Management API endpoints
  app.get("/api/health/summary", async (req, res) => {
    try {
      const summary = await storage.getHealthSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch health summary" });
    }
  });

  app.get("/api/health/journal", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const journalEntries = await storage.getHealthJournalEntries(limit);
      res.json(journalEntries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  app.get("/api/health/alerts/critical", async (req, res) => {
    try {
      const criticalAlerts = await storage.getCriticalHealthAlerts();
      res.json(criticalAlerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch critical alerts" });
    }
  });

  app.get("/api/health/treatments/active", async (req, res) => {
    try {
      const activeTreatments = await storage.getActiveTreatments();
      res.json(activeTreatments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active treatments" });
    }
  });

  app.get("/api/health/mortality/recent", async (req, res) => {
    try {
      const recentMortality = await storage.getRecentMortalityRecords();
      res.json(recentMortality);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mortality records" });
    }
  });

  app.get("/api/health/lice/recent", async (req, res) => {
    try {
      const liceCounts = await storage.getRecentLiceCounts();
      res.json(liceCounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lice counts" });
    }
  });

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

  // FIFO Feed Management System API endpoints
  app.get("/api/v1/inventory/feed-purchases/", async (req, res) => {
    try {
      const purchases = await storage.getFeedPurchases();
      res.json({
        count: purchases.length,
        next: null,
        previous: null,
        results: purchases
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feed purchases" });
    }
  });

  app.post("/api/v1/inventory/feed-purchases/", async (req, res) => {
    try {
      const validatedData = insertFeedPurchaseSchema.parse(req.body);
      const purchase = await storage.createFeedPurchase(validatedData);
      res.status(201).json(purchase);
    } catch (error) {
      res.status(400).json({ error: "Invalid feed purchase data" });
    }
  });

  app.get("/api/v1/inventory/feed-containers/", async (req, res) => {
    try {
      const containers = await storage.getFeedContainers();
      res.json({
        count: containers.length,
        next: null,
        previous: null,
        results: containers
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feed containers" });
    }
  });

  app.post("/api/v1/inventory/feed-containers/", async (req, res) => {
    try {
      const validatedData = insertFeedContainerSchema.parse(req.body);
      const container = await storage.createFeedContainer(validatedData);
      res.status(201).json(container);
    } catch (error) {
      res.status(400).json({ error: "Invalid feed container data" });
    }
  });

  app.get("/api/v1/inventory/feed-container-stock/", async (req, res) => {
    try {
      const containerId = req.query.container_id ? parseInt(req.query.container_id as string) : undefined;
      const stock = await storage.getFeedContainerStock(containerId);
      res.json({
        count: stock.length,
        next: null,
        previous: null,
        results: stock
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feed container stock" });
    }
  });

  app.get("/api/v1/inventory/feed-container-stock/fifo_order/", async (req, res) => {
    try {
      const containerId = parseInt(req.query.container_id as string);
      if (!containerId) {
        return res.status(400).json({ error: "container_id parameter is required" });
      }
      const stock = await storage.getFeedContainerStockInFifoOrder(containerId);
      res.json({
        count: stock.length,
        next: null,
        previous: null,
        results: stock
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch FIFO ordered stock" });
    }
  });

  app.post("/api/v1/inventory/feed-container-stock/add_to_container/", async (req, res) => {
    try {
      const { feed_container, feed_purchase, quantity_kg } = req.body;
      const stock = await storage.addFeedToContainer(feed_container, feed_purchase, quantity_kg);
      res.status(201).json(stock);
    } catch (error) {
      res.status(400).json({ error: "Failed to add feed to container" });
    }
  });

  app.get("/api/v1/inventory/batch-feeding-summaries/", async (req, res) => {
    try {
      const batchId = req.query.batch ? parseInt(req.query.batch as string) : undefined;
      const summaries = await storage.getBatchFeedingSummaries(batchId);
      res.json({
        count: summaries.length,
        next: null,
        previous: null,
        results: summaries
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch batch feeding summaries" });
    }
  });

  app.post("/api/v1/inventory/batch-feeding-summaries/generate/", async (req, res) => {
    try {
      const { batch, period_start, period_end } = req.body;
      const summary = await storage.generateBatchFeedingSummary(batch, period_start, period_end);
      res.status(201).json(summary);
    } catch (error) {
      res.status(400).json({ error: "Failed to generate batch feeding summary" });
    }
  });

  // Django API v1 endpoints - Species and Stages
  app.get("/api/v1/species/", async (req, res) => {
    try {
      const species = await storage.getSpecies();
      res.json({
        count: species.length,
        next: null,
        previous: null,
        results: species
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch species" });
    }
  });

  app.post("/api/v1/species/", async (req, res) => {
    try {
      const validatedData = insertSpeciesSchema.parse(req.body);
      const species = await storage.createSpecies(validatedData);
      res.status(201).json(species);
    } catch (error) {
      res.status(400).json({ error: "Invalid species data" });
    }
  });

  app.get("/api/v1/stages/", async (req, res) => {
    try {
      const speciesId = req.query.species ? parseInt(req.query.species as string) : undefined;
      const stages = await storage.getStages(speciesId);
      res.json({
        count: stages.length,
        next: null,
        previous: null,
        results: stages
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stages" });
    }
  });

  app.post("/api/v1/stages/", async (req, res) => {
    try {
      const validatedData = insertStageSchema.parse(req.body);
      const stage = await storage.createStage(validatedData);
      res.status(201).json(stage);
    } catch (error) {
      res.status(400).json({ error: "Invalid stage data" });
    }
  });

  // Django API v1 endpoints - Health Management
  app.get("/api/v1/health/lab-samples/", async (req, res) => {
    try {
      const batchId = req.query.batch ? parseInt(req.query.batch as string) : undefined;
      const samples = await storage.getLabSamples(batchId);
      res.json({
        count: samples.length,
        next: null,
        previous: null,
        results: samples
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lab samples" });
    }
  });

  app.post("/api/v1/health/lab-samples/", async (req, res) => {
    try {
      const validatedData = insertLabSampleSchema.parse(req.body);
      const sample = await storage.createLabSample(validatedData);
      res.status(201).json(sample);
    } catch (error) {
      res.status(400).json({ error: "Invalid lab sample data" });
    }
  });

  app.get("/api/v1/health/assessments/", async (req, res) => {
    try {
      const batchId = req.query.batch ? parseInt(req.query.batch as string) : undefined;
      const assessments = await storage.getHealthAssessments(batchId);
      res.json({
        count: assessments.length,
        next: null,
        previous: null,
        results: assessments
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch health assessments" });
    }
  });

  app.post("/api/v1/health/assessments/", async (req, res) => {
    try {
      const validatedData = insertHealthAssessmentSchema.parse(req.body);
      const assessment = await storage.createHealthAssessment(validatedData);
      res.status(201).json(assessment);
    } catch (error) {
      res.status(400).json({ error: "Invalid health assessment data" });
    }
  });

  // Django API v1 endpoints - Infrastructure Management
  app.get("/api/v1/infrastructure/summary/", async (req, res) => {
    try {
      const containers = await storage.getContainers();
      const batches = await storage.getBatches();
      const feedingEvents = await storage.getFeedingEvents();
      const alerts = await storage.getActiveAlerts();
      
      const activeBiomass = batches.reduce((sum, batch) => sum + parseFloat(batch.currentBiomassKg || "0"), 0);
      const capacity = containers.reduce((sum, container) => sum + (container.capacity || 0), 0);
      const today = new Date().toISOString().split('T')[0];
      const todayEvents = feedingEvents.filter(event => event.feedingDate === today);
      
      res.json({
        totalContainers: containers.length,
        activeBiomass: Math.round(activeBiomass),
        capacity: capacity,
        sensorAlerts: alerts.length,
        feedingEventsToday: todayEvents.length
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch infrastructure summary" });
    }
  });

  app.get("/api/v1/infrastructure/geographies/", async (req, res) => {
    try {
      const farmSites = await storage.getFarmSites();
      const geographies = [
        {
          id: 1,
          name: "Faroe Islands",
          totalContainers: farmSites.filter(s => s.location.includes("Faroe")).length * 15,
          activeBiomass: farmSites.filter(s => s.location.includes("Faroe")).reduce((sum, site) => sum + site.currentStock, 0) * 50,
          capacity: farmSites.filter(s => s.location.includes("Faroe")).reduce((sum, site) => sum + site.totalCapacity, 0) * 60
        },
        {
          id: 2,
          name: "Scotland",
          totalContainers: farmSites.filter(s => s.location.includes("Scotland")).length * 12,
          activeBiomass: farmSites.filter(s => s.location.includes("Scotland")).reduce((sum, site) => sum + site.currentStock, 0) * 45,
          capacity: farmSites.filter(s => s.location.includes("Scotland")).reduce((sum, site) => sum + site.totalCapacity, 0) * 55
        }
      ];
      
      res.json({
        count: geographies.length,
        next: null,
        previous: null,
        results: geographies
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch geographies" });
    }
  });

  app.get("/api/v1/infrastructure/containers/", async (req, res) => {
    try {
      const containers = await storage.getContainers();
      const batches = await storage.getBatches();
      const readings = await storage.getEnvironmentalReadings();
      
      const enrichedContainers = containers.map(container => {
        const containerBatches = batches.filter(b => b.container === container.id);
        const containerReadings = readings.filter(r => r.container === container.id);
        
        return {
          id: container.id,
          name: container.name,
          type: container.containerType,
          geography: "Faroe Islands",
          area: container.location || "Unknown",
          biomass: containerBatches.reduce((sum, batch) => sum + parseFloat(batch.currentBiomassKg || "0"), 0),
          capacity: container.capacity,
          currentBatch: containerBatches[0]?.name || "None",
          lastFeed: "2h ago",
          sensorReadings: {
            temperature: containerReadings.find(r => r.parameter === 1)?.value ? parseFloat(containerReadings.find(r => r.parameter === 1)?.value || "0") : undefined,
            oxygen: containerReadings.find(r => r.parameter === 2)?.value ? parseFloat(containerReadings.find(r => r.parameter === 2)?.value || "0") : undefined,
            co2: containerReadings.find(r => r.parameter === 3)?.value ? parseFloat(containerReadings.find(r => r.parameter === 3)?.value || "0") : undefined
          },
          status: container.status
        };
      });
      
      res.json({
        count: enrichedContainers.length,
        next: null,
        previous: null,
        results: enrichedContainers
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch containers" });
    }
  });

  app.get("/api/v1/infrastructure/alerts/", async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      const containers = await storage.getContainers();
      
      const enrichedAlerts = alerts.map(alert => {
        const container = containers.find(c => c.id === alert.farmSiteId);
        return {
          id: alert.id,
          containerId: alert.farmSiteId,
          containerName: container?.name || `Container ${alert.farmSiteId}`,
          type: alert.type,
          message: alert.description,
          severity: alert.severity,
          timestamp: new Date(alert.createdAt).toLocaleString()
        };
      });
      
      res.json({
        count: enrichedAlerts.length,
        next: null,
        previous: null,
        results: enrichedAlerts
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  // Django API v1 endpoints - Environmental Weather
  app.get("/api/v1/environmental/weather/", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const weatherData = await storage.getWeatherData(limit);
      res.json({
        count: weatherData.length,
        next: null,
        previous: null,
        results: weatherData
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  app.post("/api/v1/environmental/weather/", async (req, res) => {
    try {
      const validatedData = insertWeatherDataSchema.parse(req.body);
      const weather = await storage.createWeatherData(validatedData);
      res.status(201).json(weather);
    } catch (error) {
      res.status(400).json({ error: "Invalid weather data" });
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
