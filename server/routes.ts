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
      // Faroe Islands: 12 freshwater stations + 25 areas
      // Scotland: 8 freshwater stations + 20 areas
      
      const faroeStations = 12;
      const faroeAreas = 25;
      const scotlandStations = 8;
      const scotlandAreas = 20;
      
      // Faroe: 5-6 halls per station, 8-16 containers per hall, 18-26 rings per area
      const faroeContainers = (faroeStations * 5.5 * 12) + (faroeAreas * 22); // ~1,881 containers
      const faroeActiveBiomass = Math.round(faroeContainers * 15.2); // ~28,600 tons
      const faroeCapacity = Math.round(faroeContainers * 18.5); // ~34,800 tons
      
      // Scotland: 5-6 halls per station, 8-16 containers per hall, 10-20 rings per area
      const scotlandContainers = (scotlandStations * 5.5 * 12) + (scotlandAreas * 15); // ~828 containers  
      const scotlandActiveBiomass = Math.round(scotlandContainers * 14.8); // ~12,254 tons
      const scotlandCapacity = Math.round(scotlandContainers * 17.2); // ~14,242 tons
      
      const geographies = [
        {
          id: 1,
          name: "Faroe Islands",
          totalContainers: faroeContainers,
          activeBiomass: faroeActiveBiomass,
          capacity: faroeCapacity,
          freshwaterStations: faroeStations,
          seaAreas: faroeAreas,
          coordinates: { lat: 62.0, lng: -6.8 }
        },
        {
          id: 2,
          name: "Scotland",
          totalContainers: scotlandContainers,
          activeBiomass: scotlandActiveBiomass,
          capacity: scotlandCapacity,
          freshwaterStations: scotlandStations,
          seaAreas: scotlandAreas,
          coordinates: { lat: 56.8, lng: -5.5 }
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

  app.get("/api/v1/infrastructure/areas/", async (req, res) => {
    try {
      const geography = req.query.geography as string;
      
      const faroeAreas = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Faroe Area ${String.fromCharCode(65 + Math.floor(i / 5))}${(i % 5) + 1}`,
        geography: "Faroe Islands",
        type: "sea_area",
        rings: Math.floor(Math.random() * 9) + 18, // 18-26 rings
        totalBiomass: Math.round((Math.floor(Math.random() * 9) + 18) * 15.2),
        coordinates: {
          lat: 62.0 + (Math.random() - 0.5) * 0.6,
          lng: -6.8 + (Math.random() - 0.5) * 1.2
        },
        status: Math.random() > 0.1 ? "active" : "maintenance",
        waterDepth: Math.round(Math.random() * 80 + 40), // 40-120m
        lastInspection: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      const scotlandAreas = Array.from({ length: 20 }, (_, i) => ({
        id: i + 26,
        name: `Scotland Area ${String.fromCharCode(65 + Math.floor(i / 4))}${(i % 4) + 1}`,
        geography: "Scotland",
        type: "sea_area", 
        rings: Math.floor(Math.random() * 11) + 10, // 10-20 rings
        totalBiomass: Math.round((Math.floor(Math.random() * 11) + 10) * 14.8),
        coordinates: {
          lat: 56.8 + (Math.random() - 0.5) * 1.0,
          lng: -5.5 + (Math.random() - 0.5) * 2.0
        },
        status: Math.random() > 0.15 ? "active" : "maintenance",
        waterDepth: Math.round(Math.random() * 60 + 30), // 30-90m
        lastInspection: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      let areas = [...faroeAreas, ...scotlandAreas];
      
      if (geography && geography !== "all") {
        areas = areas.filter(area => area.geography.toLowerCase().includes(geography.toLowerCase()));
      }
      
      res.json({
        count: areas.length,
        next: null,
        previous: null,
        results: areas
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch areas" });
    }
  });

  app.get("/api/v1/infrastructure/stations/", async (req, res) => {
    try {
      const geography = req.query.geography as string;
      
      const faroeStations = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `Faroe Station ${String.fromCharCode(65 + i)}`,
        geography: "Faroe Islands",
        type: "freshwater_station",
        halls: Math.floor(Math.random() * 2) + 5, // 5-6 halls
        totalContainers: (Math.floor(Math.random() * 2) + 5) * (Math.floor(Math.random() * 9) + 8), // 5-6 halls * 8-16 containers
        totalBiomass: Math.round(((Math.floor(Math.random() * 2) + 5) * (Math.floor(Math.random() * 9) + 8)) * 0.8), // smaller biomass for freshwater
        coordinates: {
          lat: 62.0 + (Math.random() - 0.5) * 0.4,
          lng: -6.8 + (Math.random() - 0.5) * 0.8
        },
        status: Math.random() > 0.05 ? "active" : "maintenance",
        waterSource: Math.random() > 0.5 ? "river" : "well",
        lastInspection: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      const scotlandStations = Array.from({ length: 8 }, (_, i) => ({
        id: i + 13,
        name: `Scotland Station ${String.fromCharCode(65 + i)}`,
        geography: "Scotland", 
        type: "freshwater_station",
        halls: Math.floor(Math.random() * 2) + 5, // 5-6 halls
        totalContainers: (Math.floor(Math.random() * 2) + 5) * (Math.floor(Math.random() * 9) + 8), // 5-6 halls * 8-16 containers
        totalBiomass: Math.round(((Math.floor(Math.random() * 2) + 5) * (Math.floor(Math.random() * 9) + 8)) * 0.8), // smaller biomass for freshwater
        coordinates: {
          lat: 56.8 + (Math.random() - 0.5) * 0.8,
          lng: -5.5 + (Math.random() - 0.5) * 1.5
        },
        status: Math.random() > 0.1 ? "active" : "maintenance",
        waterSource: Math.random() > 0.3 ? "river" : "well",
        lastInspection: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      let stations = [...faroeStations, ...scotlandStations];
      
      if (geography && geography !== "all") {
        stations = stations.filter(station => station.geography.toLowerCase().includes(geography.toLowerCase()));
      }
      
      res.json({
        count: stations.length,
        next: null,
        previous: null,
        results: stations
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stations" });
    }
  });

  // Cache for area details to avoid regenerating random data
  const areaDetailsCache = new Map();
  
  app.get("/api/v1/infrastructure/areas/:id", async (req, res) => {
    try {
      const areaId = parseInt(req.params.id);
      
      // Check cache first
      if (areaDetailsCache.has(areaId)) {
        return res.json(areaDetailsCache.get(areaId));
      }
      
      // Generate detailed area data (seeded for consistency)
      const seedValue = areaId * 12345; // Deterministic seed
      const seededRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };
      
      const area = {
        id: areaId,
        name: areaId <= 25 ? `Faroe Area ${String.fromCharCode(65 + Math.floor((areaId-1) / 5))}${((areaId-1) % 5) + 1}` : `Scotland Area ${String.fromCharCode(65 + Math.floor((areaId-26) / 4))}${((areaId-26) % 4) + 1}`,
        geography: areaId <= 25 ? "Faroe Islands" : "Scotland",
        type: "sea_area",
        rings: Math.floor(seededRandom(seedValue) * 9) + (areaId <= 25 ? 18 : 10),
        coordinates: {
          lat: areaId <= 25 ? 62.0 + (seededRandom(seedValue + 1) - 0.5) * 0.6 : 56.8 + (seededRandom(seedValue + 1) - 0.5) * 1.0,
          lng: areaId <= 25 ? -6.8 + (seededRandom(seedValue + 2) - 0.5) * 1.2 : -5.5 + (seededRandom(seedValue + 2) - 0.5) * 2.0
        },
        status: seededRandom(seedValue + 3) > 0.1 ? "active" : "maintenance",
        waterDepth: Math.round(seededRandom(seedValue + 4) * 80 + 40),
        lastInspection: new Date(Date.now() - seededRandom(seedValue + 5) * 7 * 24 * 60 * 60 * 1000).toISOString(),
        
        // Detailed operational data
        totalBiomass: 0, // Will calculate from rings
        capacity: 0, // Will calculate
        currentStock: 0,
        averageWeight: Math.round((seededRandom(seedValue + 6) * 2 + 3) * 100) / 100, // 3-5 kg
        mortalityRate: Math.round(seededRandom(seedValue + 7) * 0.5 * 100) / 100, // 0-0.5%
        feedConversion: Math.round((seededRandom(seedValue + 8) * 0.3 + 1.1) * 100) / 100, // 1.1-1.4
        
        // Environmental conditions
        waterTemperature: Math.round((seededRandom(seedValue + 9) * 4 + 8) * 10) / 10, // 8-12°C
        oxygenLevel: Math.round((seededRandom(seedValue + 10) * 2 + 8) * 10) / 10, // 8-10 mg/L
        salinity: Math.round((seededRandom(seedValue + 11) * 2 + 34) * 10) / 10, // 34-36 ppt
        currentSpeed: Math.round(seededRandom(seedValue + 12) * 0.5 * 100) / 100, // 0-0.5 m/s
        
        // Recent activities
        lastFeeding: new Date(Date.now() - seededRandom(seedValue + 13) * 12 * 60 * 60 * 1000).toISOString(),
        nextScheduledMaintenance: new Date(Date.now() + seededRandom(seedValue + 14) * 30 * 24 * 60 * 60 * 1000).toISOString(),
        
        // License and regulatory
        licenseNumber: `LA-${areaId <= 25 ? 'FO' : 'SC'}-${String(areaId).padStart(3, '0')}`,
        licenseExpiry: new Date(Date.now() + (seededRandom(seedValue + 15) * 365 + 365) * 24 * 60 * 60 * 1000).toISOString(),
        maxBiomassAllowed: Math.round(seededRandom(seedValue + 16) * 1000 + 2000), // 2000-3000 tons
      };
      
      // Calculate derived values
      area.totalBiomass = Math.round(area.rings * 15.2);
      area.capacity = Math.round(area.rings * 18.5);
      area.currentStock = Math.round(area.totalBiomass / area.averageWeight * 1000); // Fish count
      
      // Cache the result
      areaDetailsCache.set(areaId, area);
      
      res.json(area);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch area details" });
    }
  });

  // Cache for station details to avoid regenerating random data
  const stationDetailsCache = new Map();
  
  app.get("/api/v1/infrastructure/stations/:id", async (req, res) => {
    try {
      const stationId = parseInt(req.params.id);
      
      // Check cache first
      if (stationDetailsCache.has(stationId)) {
        return res.json(stationDetailsCache.get(stationId));
      }
      
      // Generate detailed station data (seeded for consistency)
      const seedValue = stationId * 54321; // Deterministic seed
      const seededRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };
      
      const station = {
        id: stationId,
        name: stationId <= 12 ? `Faroe Station ${String.fromCharCode(65 + (stationId-1))}` : `Scotland Station ${String.fromCharCode(65 + (stationId-13))}`,
        geography: stationId <= 12 ? "Faroe Islands" : "Scotland",
        type: "freshwater_station",
        halls: Math.floor(seededRandom(seedValue) * 2) + 5, // 5-6 halls
        coordinates: {
          lat: stationId <= 12 ? 62.0 + (seededRandom(seedValue + 1) - 0.5) * 0.4 : 56.8 + (seededRandom(seedValue + 1) - 0.5) * 0.8,
          lng: stationId <= 12 ? -6.8 + (seededRandom(seedValue + 2) - 0.5) * 0.8 : -5.5 + (seededRandom(seedValue + 2) - 0.5) * 1.5
        },
        status: seededRandom(seedValue + 3) > 0.05 ? "active" : "maintenance",
        waterSource: seededRandom(seedValue + 4) > 0.5 ? "river" : "well",
        lastInspection: new Date(Date.now() - seededRandom(seedValue + 5) * 7 * 24 * 60 * 60 * 1000).toISOString(),
        
        // Operational metrics
        totalContainers: 0, // Will calculate
        totalBiomass: 0, // Will calculate
        capacity: 0,
        currentStock: 0,
        averageWeight: Math.round(seededRandom(seedValue + 6) * 100) / 1000 + 0.05, // 50-150g for freshwater
        mortalityRate: Math.round(seededRandom(seedValue + 7) * 1.0 * 100) / 100, // 0-1.0%
        feedConversion: Math.round((seededRandom(seedValue + 8) * 0.2 + 0.9) * 100) / 100, // 0.9-1.1
        
        // Environmental conditions
        waterTemperature: Math.round((seededRandom(seedValue + 9) * 6 + 6) * 10) / 10, // 6-12°C
        oxygenLevel: Math.round((seededRandom(seedValue + 10) * 2 + 9) * 10) / 10, // 9-11 mg/L
        pH: Math.round((seededRandom(seedValue + 11) * 1 + 6.5) * 100) / 100, // 6.5-7.5
        flowRate: Math.round((seededRandom(seedValue + 12) * 50 + 50) * 10) / 10, // 50-100 L/min per tank
        
        // Infrastructure details
        powerConsumption: Math.round(seededRandom(seedValue + 13) * 200 + 100), // 100-300 kW
        waterUsage: Math.round(seededRandom(seedValue + 14) * 1000 + 500), // 500-1500 m³/day
        
        // Maintenance and operations
        lastMaintenance: new Date(Date.now() - seededRandom(seedValue + 15) * 30 * 24 * 60 * 60 * 1000).toISOString(),
        nextScheduledMaintenance: new Date(Date.now() + seededRandom(seedValue + 16) * 30 * 24 * 60 * 60 * 1000).toISOString(),
        
        // Staff and certifications
        staffCount: Math.floor(seededRandom(seedValue + 17) * 8) + 4, // 4-12 staff
        certificationStatus: seededRandom(seedValue + 18) > 0.1 ? "valid" : "renewal_required",
        lastAudit: new Date(Date.now() - seededRandom(seedValue + 19) * 180 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      // Calculate derived values
      station.totalContainers = station.halls * (Math.floor(seededRandom(seedValue + 20) * 9) + 8); // 8-16 containers per hall
      station.totalBiomass = Math.round(station.totalContainers * 0.8);
      station.capacity = Math.round(station.totalContainers * 1.2);
      station.currentStock = Math.round(station.totalBiomass / station.averageWeight * 1000); // Fish count
      
      // Cache the result
      stationDetailsCache.set(stationId, station);
      
      res.json(station);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch station details" });
    }
  });

  app.get("/api/v1/infrastructure/areas/:id/rings", async (req, res) => {
    try {
      const areaId = parseInt(req.params.id);
      const areaName = areaId <= 25 ? `Faroe Area ${String.fromCharCode(65 + Math.floor((areaId-1) / 5))}${((areaId-1) % 5) + 1}` : `Scotland Area ${String.fromCharCode(65 + Math.floor((areaId-26) / 4))}${((areaId-26) % 4) + 1}`;
      
      const ringCount = Math.floor(Math.sin(areaId * 12345) * 4 + 22); // 18-26 rings for Faroe, 10-20 for Scotland
      const rings = Array.from({ length: ringCount }, (_, i) => {
        const ringId = areaId * 100 + i + 1;
        const seedValue = ringId * 7890;
        const seededRandom = (seed: number) => {
          const x = Math.sin(seed) * 10000;
          return x - Math.floor(x);
        };
        
        return {
          id: ringId,
          name: `Ring ${String.fromCharCode(65 + i)}`,
          areaId,
          areaName,
          status: seededRandom(seedValue) > 0.1 ? "active" : "maintenance",
          biomass: Math.round(seededRandom(seedValue + 1) * 20 + 10), // 10-30 tons per ring
          capacity: Math.round(seededRandom(seedValue + 2) * 25 + 25), // 25-50 tons capacity
          fishCount: Math.round(seededRandom(seedValue + 3) * 8000 + 2000), // 2000-10000 fish
          averageWeight: Math.round((seededRandom(seedValue + 4) * 2 + 3) * 100) / 100, // 3-5 kg
          waterDepth: Math.round(seededRandom(seedValue + 5) * 40 + 30), // 30-70m
          netCondition: ["excellent", "good", "fair"][Math.floor(seededRandom(seedValue + 6) * 3)],
          lastInspection: new Date(Date.now() - seededRandom(seedValue + 7) * 14 * 24 * 60 * 60 * 1000).toISOString(),
          coordinates: {
            lat: (areaId <= 25 ? 62.0 : 56.8) + (seededRandom(seedValue + 8) - 0.5) * 0.1,
            lng: (areaId <= 25 ? -6.8 : -5.5) + (seededRandom(seedValue + 9) - 0.5) * 0.1
          },
          environmentalStatus: seededRandom(seedValue + 10) > 0.3 ? "optimal" : "monitoring"
        };
      });
      
      res.json({
        count: rings.length,
        results: rings
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rings" });
    }
  });

  app.get("/api/v1/infrastructure/stations/:id/halls", async (req, res) => {
    try {
      const stationId = parseInt(req.params.id);
      const stationName = stationId <= 12 ? `Faroe Station ${String.fromCharCode(65 + (stationId-1))}` : `Scotland Station ${String.fromCharCode(65 + (stationId-13))}`;
      
      const hallCount = Math.floor(Math.sin(stationId * 54321) * 2) + 5; // 5-6 halls
      const halls = Array.from({ length: hallCount }, (_, i) => {
        const hallId = stationId * 100 + i + 1;
        const seedValue = hallId * 9876;
        const seededRandom = (seed: number) => {
          const x = Math.sin(seed) * 10000;
          return x - Math.floor(x);
        };
        
        const containers = Math.floor(seededRandom(seedValue) * 9) + 8; // 8-16 containers per hall
        
        return {
          id: hallId,
          name: `Hall ${i + 1}`,
          stationId,
          stationName,
          status: seededRandom(seedValue + 1) > 0.05 ? "active" : "maintenance",
          containers,
          totalBiomass: Math.round(containers * 0.8), // ~0.8 tons per container
          capacity: Math.round(containers * 1.2), // ~1.2 tons capacity per container
          temperature: Math.round((seededRandom(seedValue + 2) * 6 + 6) * 10) / 10, // 6-12°C
          oxygenLevel: Math.round((seededRandom(seedValue + 3) * 2 + 9) * 10) / 10, // 9-11 mg/L
          flowRate: Math.round((seededRandom(seedValue + 4) * 50 + 50) * 10) / 10, // 50-100 L/min
          powerUsage: Math.round(seededRandom(seedValue + 5) * 30 + 20), // 20-50 kW per hall
          lastMaintenance: new Date(Date.now() - seededRandom(seedValue + 6) * 30 * 24 * 60 * 60 * 1000).toISOString(),
          systemStatus: seededRandom(seedValue + 7) > 0.2 ? "optimal" : "monitoring"
        };
      });
      
      res.json({
        count: halls.length,
        results: halls
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch halls" });
    }
  });

  app.get("/api/v1/infrastructure/rings/:id", async (req, res) => {
    try {
      const ringId = parseInt(req.params.id);
      const areaId = Math.floor(ringId / 100);
      const areaName = areaId <= 25 ? `Faroe Area ${String.fromCharCode(65 + Math.floor((areaId-1) / 5))}${((areaId-1) % 5) + 1}` : `Scotland Area ${String.fromCharCode(65 + Math.floor((areaId-26) / 4))}${((areaId-26) % 4) + 1}`;
      
      const seedValue = ringId * 7890;
      const seededRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };
      
      const ring = {
        id: ringId,
        name: `Ring ${String.fromCharCode(65 + ((ringId - 1) % 26))}`,
        areaId,
        areaName,
        status: seededRandom(seedValue) > 0.1 ? "active" : "maintenance",
        biomass: Math.round(seededRandom(seedValue + 1) * 20 + 10), // 10-30 tons per ring
        capacity: Math.round(seededRandom(seedValue + 2) * 25 + 25), // 25-50 tons capacity
        fishCount: Math.round(seededRandom(seedValue + 3) * 8000 + 2000), // 2000-10000 fish
        averageWeight: Math.round((seededRandom(seedValue + 4) * 2 + 3) * 100) / 100, // 3-5 kg
        waterDepth: Math.round(seededRandom(seedValue + 5) * 40 + 30), // 30-70m
        netCondition: ["excellent", "good", "fair"][Math.floor(seededRandom(seedValue + 6) * 3)],
        lastInspection: new Date(Date.now() - seededRandom(seedValue + 7) * 14 * 24 * 60 * 60 * 1000).toISOString(),
        coordinates: {
          lat: (areaId <= 25 ? 62.0 : 56.8) + (seededRandom(seedValue + 8) - 0.5) * 0.1,
          lng: (areaId <= 25 ? -6.8 : -5.5) + (seededRandom(seedValue + 9) - 0.5) * 0.1
        },
        environmentalStatus: seededRandom(seedValue + 10) > 0.3 ? "optimal" : "monitoring",
        
        // Additional detailed fields
        netLastChanged: new Date(Date.now() - seededRandom(seedValue + 11) * 180 * 24 * 60 * 60 * 1000).toISOString(),
        netType: ["Standard", "Anti-predator", "High-flow"][Math.floor(seededRandom(seedValue + 12) * 3)],
        cageVolume: Math.round(seededRandom(seedValue + 13) * 50000 + 30000), // 30000-80000 m³
        installedDate: new Date(Date.now() - seededRandom(seedValue + 14) * 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastFeedingTime: new Date(Date.now() - seededRandom(seedValue + 15) * 8 * 60 * 60 * 1000).toISOString(),
        dailyFeedAmount: Math.round(seededRandom(seedValue + 16) * 500 + 400), // 400-900 kg
        mortalityRate: Math.round(seededRandom(seedValue + 17) * 0.3 * 100) / 100, // 0-0.3%
        feedConversionRatio: Math.round((seededRandom(seedValue + 18) * 0.3 + 1.0) * 100) / 100, // 1.0-1.3
        waterTemperature: Math.round((seededRandom(seedValue + 19) * 4 + 6) * 10) / 10, // 6-10°C
        salinity: Math.round((seededRandom(seedValue + 20) * 2 + 33) * 10) / 10, // 33-35‰
        currentSpeed: Math.round((seededRandom(seedValue + 21) * 0.5 + 0.1) * 100) / 100, // 0.1-0.6 m/s
        oxygenSaturation: Math.round((seededRandom(seedValue + 22) * 5 + 90) * 10) / 10, // 90-95%
      };
      
      res.json(ring);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ring details" });
    }
  });

  app.get("/api/v1/infrastructure/halls/:id/containers", async (req, res) => {
    try {
      const hallId = parseInt(req.params.id);
      const stationId = Math.floor(hallId / 100);
      const stationName = stationId <= 12 ? `Faroe Station ${String.fromCharCode(65 + (stationId-1))}` : `Scotland Station ${String.fromCharCode(65 + (stationId-13))}`;
      const hallName = `Hall ${((hallId - 1) % 10) + 1}`;
      
      const containerCount = Math.floor(Math.sin(hallId * 9876) * 9) + 8; // 8-16 containers per hall
      const hallStage = ["Egg&Alevin", "Fry", "Parr", "Smolt", "Post-Smolt"][hallId % 5]; // Different stages per hall
      const containerType = {
        "Egg&Alevin": "Tray",
        "Fry": "Fry Tank", 
        "Parr": "Parr Tank",
        "Smolt": "Smolt Tank",
        "Post-Smolt": "Post-Smolt Tank"
      }[hallStage] || "Fry Tank";
      
      const containers = Array.from({ length: containerCount }, (_, i) => {
        const containerId = hallId * 100 + i + 1;
        const seedValue = containerId * 5432;
        const seededRandom = (seed: number) => {
          const x = Math.sin(seed) * 10000;
          return x - Math.floor(x);
        };
        
        // Different scales based on stage
        const scaleFactors = {
          "Egg&Alevin": { biomass: 0.1, fishCount: 50000, weight: 0.001 },
          "Fry": { biomass: 2, fishCount: 10000, weight: 0.2 },
          "Parr": { biomass: 15, fishCount: 2000, weight: 7.5 },
          "Smolt": { biomass: 50, fishCount: 1000, weight: 50 },
          "Post-Smolt": { biomass: 120, fishCount: 500, weight: 240 }
        };
        
        const scale = scaleFactors[hallStage as keyof typeof scaleFactors];
        
        return {
          id: containerId,
          name: `${containerType} ${String.fromCharCode(65 + i)}`,
          hallId,
          hallName,
          stationId,
          stationName,
          type: containerType,
          stage: hallStage,
          status: seededRandom(seedValue) > 0.05 ? "active" : "maintenance",
          biomass: Math.round(seededRandom(seedValue + 1) * scale.biomass * 2 + scale.biomass),
          capacity: Math.round(seededRandom(seedValue + 2) * scale.biomass * 3 + scale.biomass * 2),
          fishCount: Math.round(seededRandom(seedValue + 3) * scale.fishCount + scale.fishCount / 2),
          averageWeight: Math.round((seededRandom(seedValue + 4) * scale.weight * 0.5 + scale.weight) * 1000) / 1000,
          temperature: Math.round((seededRandom(seedValue + 5) * 6 + 6) * 10) / 10, // 6-12°C
          oxygenLevel: Math.round((seededRandom(seedValue + 6) * 2 + 9) * 10) / 10, // 9-11 mg/L
          flowRate: Math.round((seededRandom(seedValue + 7) * 50 + 50) * 10) / 10, // 50-100 L/min
          lastMaintenance: new Date(Date.now() - seededRandom(seedValue + 8) * 30 * 24 * 60 * 60 * 1000).toISOString(),
          systemStatus: seededRandom(seedValue + 9) > 0.2 ? "optimal" : "monitoring",
          density: Math.round((seededRandom(seedValue + 10) * 20 + 15) * 10) / 10, // 15-35 kg/m³
          feedingSchedule: ["3x daily", "4x daily", "5x daily", "6x daily"][Math.floor(seededRandom(seedValue + 11) * 4)]
        };
      });
      
      res.json({
        count: containers.length,
        results: containers
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch containers" });
    }
  });

  app.get("/api/v1/infrastructure/containers/:id", async (req, res) => {
    try {
      const containerId = parseInt(req.params.id);
      const hallId = Math.floor(containerId / 100);
      const stationId = Math.floor(hallId / 100);
      const stationName = stationId <= 12 ? `Faroe Station ${String.fromCharCode(65 + (stationId-1))}` : `Scotland Station ${String.fromCharCode(65 + (stationId-13))}`;
      const hallName = `Hall ${((hallId - 1) % 10) + 1}`;
      const hallStage = ["Egg&Alevin", "Fry", "Parr", "Smolt", "Post-Smolt"][hallId % 5];
      const containerType = {
        "Egg&Alevin": "Tray",
        "Fry": "Fry Tank", 
        "Parr": "Parr Tank",
        "Smolt": "Smolt Tank",
        "Post-Smolt": "Post-Smolt Tank"
      }[hallStage] || "Fry Tank";
      
      const seedValue = containerId * 5432;
      const seededRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };
      
      const scaleFactors = {
        "Egg&Alevin": { biomass: 0.1, fishCount: 50000, weight: 0.001, volume: 500 },
        "Fry": { biomass: 2, fishCount: 10000, weight: 0.2, volume: 2000 },
        "Parr": { biomass: 15, fishCount: 2000, weight: 7.5, volume: 5000 },
        "Smolt": { biomass: 50, fishCount: 1000, weight: 50, volume: 10000 },
        "Post-Smolt": { biomass: 120, fishCount: 500, weight: 240, volume: 15000 }
      };
      
      const scale = scaleFactors[hallStage as keyof typeof scaleFactors];
      
      const container = {
        id: containerId,
        name: `${containerType} ${String.fromCharCode(65 + ((containerId - 1) % 26))}`,
        hallId,
        hallName,
        stationId,
        stationName,
        type: containerType,
        stage: hallStage,
        status: seededRandom(seedValue) > 0.05 ? "active" : "maintenance",
        biomass: Math.round(seededRandom(seedValue + 1) * scale.biomass * 2 + scale.biomass),
        capacity: Math.round(seededRandom(seedValue + 2) * scale.biomass * 3 + scale.biomass * 2),
        fishCount: Math.round(seededRandom(seedValue + 3) * scale.fishCount + scale.fishCount / 2),
        averageWeight: Math.round((seededRandom(seedValue + 4) * scale.weight * 0.5 + scale.weight) * 1000) / 1000,
        temperature: Math.round((seededRandom(seedValue + 5) * 6 + 6) * 10) / 10,
        oxygenLevel: Math.round((seededRandom(seedValue + 6) * 2 + 9) * 10) / 10,
        flowRate: Math.round((seededRandom(seedValue + 7) * 50 + 50) * 10) / 10,
        lastMaintenance: new Date(Date.now() - seededRandom(seedValue + 8) * 30 * 24 * 60 * 60 * 1000).toISOString(),
        systemStatus: seededRandom(seedValue + 9) > 0.2 ? "optimal" : "monitoring",
        density: Math.round((seededRandom(seedValue + 10) * 20 + 15) * 10) / 10,
        feedingSchedule: ["3x daily", "4x daily", "5x daily", "6x daily"][Math.floor(seededRandom(seedValue + 11) * 4)],
        
        // Additional detailed fields
        volume: Math.round(seededRandom(seedValue + 12) * scale.volume * 2 + scale.volume),
        installDate: new Date(Date.now() - seededRandom(seedValue + 13) * 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastFeedingTime: new Date(Date.now() - seededRandom(seedValue + 14) * 8 * 60 * 60 * 1000).toISOString(),
        dailyFeedAmount: Math.round((seededRandom(seedValue + 15) * scale.biomass * 0.5 + scale.biomass * 0.5) * 100) / 100,
        mortalityRate: Math.round(seededRandom(seedValue + 16) * 0.3 * 100) / 100,
        feedConversionRatio: Math.round((seededRandom(seedValue + 17) * 0.2 + 0.85) * 100) / 100,
        pH: Math.round((seededRandom(seedValue + 18) * 1 + 6.5) * 100) / 100,
        salinity: Math.round((seededRandom(seedValue + 19) * 1 + 0.2) * 10) / 10,
        lightingSchedule: ["12L:12D", "14L:10D", "16L:8D", "24L:0D"][Math.floor(seededRandom(seedValue + 20) * 4)],
        waterExchangeRate: Math.round((seededRandom(seedValue + 21) * 10 + 10) * 10) / 10,
        powerConsumption: Math.round((seededRandom(seedValue + 22) * 3 + 1) * 10) / 10,
        filtrationSystem: ["Standard", "Bio-filter", "RAS", "Drum filter"][Math.floor(seededRandom(seedValue + 23) * 4)],
        lastCleaning: new Date(Date.now() - seededRandom(seedValue + 24) * 7 * 24 * 60 * 60 * 1000).toISOString(),
        nextScheduledMaintenance: new Date(Date.now() + seededRandom(seedValue + 25) * 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      res.json(container);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch container details" });
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
