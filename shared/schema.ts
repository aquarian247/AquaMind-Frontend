import { pgTable, text, serial, integer, boolean, timestamp, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table matching Django auth model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  isStaff: boolean("is_staff").notNull().default(false),
  dateJoined: timestamp("date_joined").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

// Environmental Parameters - Core environmental metrics
export const environmentalParameters = pgTable("environmental_parameters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  unit: text("unit").notNull(),
  description: text("description"),
  minValue: decimal("min_value", { precision: 10, scale: 4 }),
  maxValue: decimal("max_value", { precision: 10, scale: 4 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Containers - Fish holding areas (equivalent to pens)
export const containers = pgTable("containers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  containerType: text("container_type").notNull(), // 'pen', 'cage', 'tank'
  capacity: integer("capacity").notNull(),
  location: text("location"),
  coordinates: text("coordinates"),
  depth: decimal("depth", { precision: 5, scale: 2 }),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sensors for monitoring
export const sensors = pgTable("sensors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sensorType: text("sensor_type").notNull(),
  model: text("model"),
  location: text("location"),
  container: integer("container").references(() => containers.id),
  isActive: boolean("is_active").notNull().default(true),
  installationDate: date("installation_date"),
  lastMaintenance: date("last_maintenance"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Environmental Readings - Water quality and environmental data
export const environmentalReadings = pgTable("environmental_readings", {
  id: serial("id").primaryKey(),
  parameter: integer("parameter").references(() => environmentalParameters.id).notNull(),
  readingTime: timestamp("reading_time").notNull(),
  value: decimal("value", { precision: 10, scale: 4 }).notNull(),
  sensor: integer("sensor").references(() => sensors.id),
  container: integer("container").references(() => containers.id).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Broodstock Management Tables
export const broodstockPairs = pgTable("broodstock_pairs", {
  id: serial("id").primaryKey(),
  pairName: text("pair_name").notNull(),
  maleFishId: text("male_fish_id").notNull(),
  femaleFishId: text("female_fish_id").notNull(),
  pairingDate: date("pairing_date").notNull(),
  progenyCount: integer("progeny_count"),
  geneticTraits: text("genetic_traits"), // JSON string of traits
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const eggSuppliers = pgTable("egg_suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactInfo: text("contact_info"),
  certifications: text("certifications"),
  country: text("country"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Batches - Fish groups with broodstock traceability
export const batches = pgTable("batches", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  species: integer("species").references(() => species.id).notNull(),
  startDate: date("start_date").notNull(),
  initialCount: integer("initial_count").notNull(),
  initialBiomassKg: decimal("initial_biomass_kg", { precision: 10, scale: 2 }).notNull(),
  currentCount: integer("current_count").notNull(),
  currentBiomassKg: decimal("current_biomass_kg", { precision: 10, scale: 2 }).notNull(),
  container: integer("container").references(() => containers.id),
  stage: integer("stage").references(() => stages.id),
  status: text("status").notNull().default("active"), // 'active', 'harvested', 'transferred'
  expectedHarvestDate: date("expected_harvest_date"),
  notes: text("notes"),
  // Broodstock traceability fields
  eggSource: text("egg_source").notNull(), // 'internal' or 'external'
  broodstockPairId: integer("broodstock_pair_id").references(() => broodstockPairs.id),
  eggSupplierId: integer("egg_supplier_id").references(() => eggSuppliers.id),
  eggBatchNumber: text("egg_batch_number"), // Supplier batch number for external eggs
  eggProductionDate: date("egg_production_date"), // Date eggs were produced/acquired
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Feed Types
export const feedTypes = pgTable("feed_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  manufacturer: text("manufacturer"),
  proteinContent: decimal("protein_content", { precision: 4, scale: 2 }),
  fatContent: decimal("fat_content", { precision: 4, scale: 2 }),
  pelletSize: text("pellet_size"),
  costPerKg: decimal("cost_per_kg", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Feed Purchases - FIFO tracking
export const feedPurchases = pgTable("feed_purchases", {
  id: serial("id").primaryKey(),
  feed: integer("feed").references(() => feedTypes.id).notNull(),
  supplier: text("supplier").notNull(),
  batchNumber: text("batch_number").notNull().unique(),
  quantityKg: decimal("quantity_kg", { precision: 10, scale: 3 }).notNull(),
  costPerKg: decimal("cost_per_kg", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: date("purchase_date").notNull(),
  expiryDate: date("expiry_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Feed Containers - Storage locations for feed
export const feedContainers = pgTable("feed_containers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  capacity: decimal("capacity", { precision: 10, scale: 3 }).notNull(),
  location: text("location"),
  containerType: text("container_type").notNull().default("silo"), // silo, bin, bag
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Feed Container Stock - FIFO tracking of feed in containers
export const feedContainerStock = pgTable("feed_container_stock", {
  id: serial("id").primaryKey(),
  feedContainer: integer("feed_container").references(() => feedContainers.id).notNull(),
  feedPurchase: integer("feed_purchase").references(() => feedPurchases.id).notNull(),
  quantityKg: decimal("quantity_kg", { precision: 10, scale: 3 }).notNull(),
  costPerKg: decimal("cost_per_kg", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: date("purchase_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Feed Inventory (Legacy - keeping for compatibility)
export const feedInventory = pgTable("feed_inventory", {
  id: serial("id").primaryKey(),
  feedType: integer("feed_type").references(() => feedTypes.id).notNull(),
  quantityKg: decimal("quantity_kg", { precision: 8, scale: 2 }).notNull(),
  location: text("location"),
  expiryDate: date("expiry_date"),
  batchNumber: text("batch_number"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Feeding Events - Enhanced with cost tracking
export const feedingEvents = pgTable("feeding_events", {
  id: serial("id").primaryKey(),
  batch: integer("batch").references(() => batches.id).notNull(),
  container: integer("container").references(() => containers.id).notNull(),
  feed: integer("feed").references(() => feedTypes.id).notNull(),
  feedingDate: date("feeding_date").notNull(),
  feedingTime: text("feeding_time").notNull(), // Time as HH:MM:SS
  amountKg: decimal("amount_kg", { precision: 8, scale: 2 }).notNull(),
  batchBiomassKg: decimal("batch_biomass_kg", { precision: 10, scale: 2 }),
  feedCost: decimal("feed_cost", { precision: 10, scale: 2 }), // Auto-calculated via FIFO
  method: text("method").notNull().default("MANUAL"), // MANUAL, AUTOMATIC
  notes: text("notes"),
  recordedBy: integer("recorded_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Batch Feeding Summaries - FCR calculations
export const batchFeedingSummaries = pgTable("batch_feeding_summaries", {
  id: serial("id").primaryKey(),
  batch: integer("batch").references(() => batches.id).notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  totalFeedKg: decimal("total_feed_kg", { precision: 10, scale: 3 }).notNull(),
  totalFeedConsumedKg: decimal("total_feed_consumed_kg", { precision: 10, scale: 3 }).notNull(),
  totalBiomassGainKg: decimal("total_biomass_gain_kg", { precision: 10, scale: 3 }).notNull(),
  fcr: decimal("fcr", { precision: 5, scale: 3 }).notNull(), // Feed Conversion Ratio
  averageFeedingPercentage: decimal("average_feeding_percentage", { precision: 5, scale: 2 }),
  feedingEventsCount: integer("feeding_events_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Species - Fish species information
export const species = pgTable("species", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  scientificName: text("scientific_name"),
  description: text("description"),
  averageWeightAtHarvest: decimal("average_weight_at_harvest", { precision: 8, scale: 2 }),
  typicalGrowthCycle: integer("typical_growth_cycle"), // days
  optimalTemperatureMin: decimal("optimal_temperature_min", { precision: 4, scale: 2 }),
  optimalTemperatureMax: decimal("optimal_temperature_max", { precision: 4, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Life Stages - Fish development stages
export const stages = pgTable("stages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  species: integer("species").references(() => species.id).notNull(),
  durationDays: integer("duration_days"),
  feedingFrequency: integer("feeding_frequency"), // times per day
  feedPercentage: decimal("feed_percentage", { precision: 4, scale: 2 }), // % of body weight
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Lab Samples - Laboratory testing
export const labSamples = pgTable("lab_samples", {
  id: serial("id").primaryKey(),
  batch: integer("batch").references(() => batches.id).notNull(),
  sampleDate: timestamp("sample_date").notNull(),
  sampleType: text("sample_type").notNull(), // 'Water', 'Fish', 'Feed'
  labId: text("lab_id").notNull(),
  results: text("results").notNull(), // JSON string
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Health Assessments - Detailed health evaluations
export const healthAssessments = pgTable("health_assessments", {
  id: serial("id").primaryKey(),
  batch: integer("batch").references(() => batches.id).notNull(),
  assessmentDate: timestamp("assessment_date").notNull(),
  veterinarian: text("veterinarian").notNull(),
  healthScore: decimal("health_score", { precision: 3, scale: 1 }), // 0.0 - 10.0
  mortalityRate: decimal("mortality_rate", { precision: 5, scale: 2 }), // percentage
  growthRate: decimal("growth_rate", { precision: 5, scale: 2 }), // percentage
  behavior: text("behavior"),
  physicalCondition: text("physical_condition"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Weather Data - Environmental conditions
export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  temperature: decimal("temperature", { precision: 4, scale: 1 }),
  humidity: decimal("humidity", { precision: 4, scale: 1 }),
  pressure: decimal("pressure", { precision: 6, scale: 1 }),
  windSpeed: decimal("wind_speed", { precision: 4, scale: 1 }),
  windDirection: text("wind_direction"),
  precipitation: decimal("precipitation", { precision: 4, scale: 1 }),
  cloudCover: decimal("cloud_cover", { precision: 4, scale: 1 }),
  weatherStation: integer("weather_station"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Batch Container Assignments - Track batch portions in containers
export const batchContainerAssignments = pgTable("batch_container_assignments", {
  id: serial("id").primaryKey(),
  batch: integer("batch").references(() => batches.id).notNull(),
  container: integer("container").references(() => containers.id).notNull(),
  lifecycleStage: integer("lifecycle_stage").references(() => stages.id).notNull(),
  populationCount: integer("population_count").notNull(),
  avgWeightG: decimal("avg_weight_g", { precision: 8, scale: 3 }),
  biomassKg: decimal("biomass_kg", { precision: 10, scale: 3 }).notNull(),
  assignmentDate: date("assignment_date").notNull(),
  departureDate: date("departure_date"),
  isActive: boolean("is_active").notNull().default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Batch Transfers - Record movements between containers
export const batchTransfers = pgTable("batch_transfers", {
  id: serial("id").primaryKey(),
  batch: integer("batch").references(() => batches.id).notNull(),
  fromContainerAssignment: integer("from_container_assignment").references(() => batchContainerAssignments.id),
  toContainerAssignment: integer("to_container_assignment").references(() => batchContainerAssignments.id).notNull(),
  transferType: text("transfer_type").notNull(), // 'MOVE', 'SPLIT', 'MERGE'
  populationCount: integer("population_count").notNull(),
  biomassKg: decimal("biomass_kg", { precision: 10, scale: 3 }).notNull(),
  transferDate: date("transfer_date").notNull(),
  transferPercentage: decimal("transfer_percentage", { precision: 5, scale: 2 }),
  reason: text("reason"),
  performedBy: integer("performed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Growth Samples - Track fish growth over time
export const growthSamples = pgTable("growth_samples", {
  id: serial("id").primaryKey(),
  containerAssignment: integer("container_assignment").references(() => batchContainerAssignments.id).notNull(),
  sampleDate: date("sample_date").notNull(),
  sampleSize: integer("sample_size").notNull(),
  avgWeightG: decimal("avg_weight_g", { precision: 8, scale: 3 }).notNull(),
  avgLengthCm: decimal("avg_length_cm", { precision: 6, scale: 2 }),
  conditionFactor: decimal("condition_factor", { precision: 6, scale: 3 }), // K-factor
  stdDeviationWeight: decimal("std_deviation_weight", { precision: 8, scale: 3 }),
  stdDeviationLength: decimal("std_deviation_length", { precision: 6, scale: 2 }),
  sampledBy: integer("sampled_by").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Mortality Events - Track mortality in specific assignments
export const mortalityEvents = pgTable("mortality_events", {
  id: serial("id").primaryKey(),
  containerAssignment: integer("container_assignment").references(() => batchContainerAssignments.id).notNull(),
  eventDate: date("event_date").notNull(),
  mortalityCount: integer("mortality_count").notNull(),
  cause: text("cause"),
  investigation: text("investigation"),
  preventiveMeasures: text("preventive_measures"),
  reportedBy: integer("reported_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Health Records (keeping existing structure for compatibility)
export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),
  batch: integer("batch").references(() => batches.id).notNull(),
  checkDate: date("check_date").notNull(),
  veterinarian: text("veterinarian"),
  healthStatus: text("health_status").notNull(), // 'excellent', 'good', 'fair', 'poor'
  mortalityCount: integer("mortality_count").default(0),
  averageWeight: decimal("average_weight", { precision: 5, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Pens - Individual containment units within farm sites
export const pens = pgTable("pens", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  farmSiteId: integer("farm_site_id").notNull(),
  capacity: integer("capacity").notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  depth: decimal("depth", { precision: 5, scale: 2 }),
  coordinates: text("coordinates"),
  status: text("status").notNull().default("active"),
  healthStatus: text("health_status").notNull().default("optimal"),
  lastInspection: timestamp("last_inspection"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Legacy compatibility tables for current frontend
export const farmSites = pgTable("farm_sites", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  coordinates: text("coordinates"),
  status: text("status").notNull().default("active"),
  totalCapacity: integer("total_capacity").notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  healthStatus: text("health_status").notNull().default("optimal"),
  lastUpdate: timestamp("last_update").defaultNow().notNull(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  farmSiteId: integer("farm_site_id").references(() => farmSites.id),
  resolved: boolean("resolved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

// Insert schemas for Django API compatibility
export const insertEnvironmentalParameterSchema = createInsertSchema(environmentalParameters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContainerSchema = createInsertSchema(containers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSensorSchema = createInsertSchema(sensors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnvironmentalReadingSchema = createInsertSchema(environmentalReadings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBroodstockPairSchema = createInsertSchema(broodstockPairs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEggSupplierSchema = createInsertSchema(eggSuppliers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBatchSchema = createInsertSchema(batches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeedTypeSchema = createInsertSchema(feedTypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// New FIFO inventory schemas
export const insertFeedPurchaseSchema = createInsertSchema(feedPurchases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeedContainerSchema = createInsertSchema(feedContainers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeedContainerStockSchema = createInsertSchema(feedContainerStock).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBatchFeedingSummarySchema = createInsertSchema(batchFeedingSummaries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeedInventorySchema = createInsertSchema(feedInventory).omit({
  id: true,
  updatedAt: true,
});

export const insertFeedingEventSchema = createInsertSchema(feedingEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  feedCost: true, // Auto-calculated via FIFO
});

export const insertHealthRecordSchema = createInsertSchema(healthRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// New Django API model schemas
export const insertSpeciesSchema = createInsertSchema(species).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStageSchema = createInsertSchema(stages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLabSampleSchema = createInsertSchema(labSamples).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHealthAssessmentSchema = createInsertSchema(healthAssessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Legacy compatibility schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  dateJoined: true,
  lastLogin: true,
});

export const insertFarmSiteSchema = createInsertSchema(farmSites).omit({
  id: true,
  lastUpdate: true,
});

export const insertPenSchema = createInsertSchema(pens).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

// Types for Django API
export type EnvironmentalParameter = typeof environmentalParameters.$inferSelect;
export type InsertEnvironmentalParameter = z.infer<typeof insertEnvironmentalParameterSchema>;

export type Container = typeof containers.$inferSelect;
export type InsertContainer = z.infer<typeof insertContainerSchema>;

export type Sensor = typeof sensors.$inferSelect;
export type InsertSensor = z.infer<typeof insertSensorSchema>;

export type EnvironmentalReading = typeof environmentalReadings.$inferSelect;
export type InsertEnvironmentalReading = z.infer<typeof insertEnvironmentalReadingSchema>;

export type Batch = typeof batches.$inferSelect;
export type InsertBatch = z.infer<typeof insertBatchSchema>;

export type FeedType = typeof feedTypes.$inferSelect;
export type InsertFeedType = z.infer<typeof insertFeedTypeSchema>;

// New FIFO inventory types
export type FeedPurchase = typeof feedPurchases.$inferSelect;
export type InsertFeedPurchase = z.infer<typeof insertFeedPurchaseSchema>;

export type FeedContainer = typeof feedContainers.$inferSelect;
export type InsertFeedContainer = z.infer<typeof insertFeedContainerSchema>;

export type FeedContainerStock = typeof feedContainerStock.$inferSelect;
export type InsertFeedContainerStock = z.infer<typeof insertFeedContainerStockSchema>;

export type BatchFeedingSummary = typeof batchFeedingSummaries.$inferSelect;
export type InsertBatchFeedingSummary = z.infer<typeof insertBatchFeedingSummarySchema>;

export type FeedInventory = typeof feedInventory.$inferSelect;
export type InsertFeedInventory = z.infer<typeof insertFeedInventorySchema>;

export type FeedingEvent = typeof feedingEvents.$inferSelect;
export type InsertFeedingEvent = z.infer<typeof insertFeedingEventSchema>;

export type HealthRecord = typeof healthRecords.$inferSelect;
export type InsertHealthRecord = z.infer<typeof insertHealthRecordSchema>;

// New Django API model types
export type Species = typeof species.$inferSelect;
export type InsertSpecies = z.infer<typeof insertSpeciesSchema>;

export type Stage = typeof stages.$inferSelect;
export type InsertStage = z.infer<typeof insertStageSchema>;

export type LabSample = typeof labSamples.$inferSelect;
export type InsertLabSample = z.infer<typeof insertLabSampleSchema>;

export type HealthAssessment = typeof healthAssessments.$inferSelect;
export type InsertHealthAssessment = z.infer<typeof insertHealthAssessmentSchema>;

export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;

// Legacy compatibility types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type FarmSite = typeof farmSites.$inferSelect;
export type InsertFarmSite = z.infer<typeof insertFarmSiteSchema>;

export type Pen = typeof pens.$inferSelect;
export type InsertPen = z.infer<typeof insertPenSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

// Broodstock Management types
export type BroodstockPair = typeof broodstockPairs.$inferSelect;
export type InsertBroodstockPair = z.infer<typeof insertBroodstockPairSchema>;

export type EggSupplier = typeof eggSuppliers.$inferSelect;
export type InsertEggSupplier = z.infer<typeof insertEggSupplierSchema>;

// Batch Container Assignment types
export const insertBatchContainerAssignmentSchema = createInsertSchema(batchContainerAssignments);
export type BatchContainerAssignment = typeof batchContainerAssignments.$inferSelect;
export type InsertBatchContainerAssignment = z.infer<typeof insertBatchContainerAssignmentSchema>;

// Batch Transfer types
export const insertBatchTransferSchema = createInsertSchema(batchTransfers);
export type BatchTransfer = typeof batchTransfers.$inferSelect;
export type InsertBatchTransfer = z.infer<typeof insertBatchTransferSchema>;

// Growth Sample types
export const insertGrowthSampleSchema = createInsertSchema(growthSamples);
export type GrowthSample = typeof growthSamples.$inferSelect;
export type InsertGrowthSample = z.infer<typeof insertGrowthSampleSchema>;

// Mortality Event types
export const insertMortalityEventSchema = createInsertSchema(mortalityEvents);
export type MortalityEvent = typeof mortalityEvents.$inferSelect;
export type InsertMortalityEvent = z.infer<typeof insertMortalityEventSchema>;