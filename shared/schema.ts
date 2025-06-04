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

// Batches - Fish groups
export const batches = pgTable("batches", {
  id: serial("id").primaryKey(),
  batchId: text("batch_id").notNull().unique(),
  species: text("species").notNull(),
  strain: text("strain"),
  quantity: integer("quantity").notNull(),
  averageWeight: decimal("average_weight", { precision: 5, scale: 2 }),
  startDate: date("start_date").notNull(),
  expectedHarvestDate: date("expected_harvest_date"),
  status: text("status").notNull().default("active"), // 'active', 'harvested', 'transferred'
  container: integer("container").references(() => containers.id),
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

// Feed Inventory
export const feedInventory = pgTable("feed_inventory", {
  id: serial("id").primaryKey(),
  feedType: integer("feed_type").references(() => feedTypes.id).notNull(),
  quantityKg: decimal("quantity_kg", { precision: 8, scale: 2 }).notNull(),
  location: text("location"),
  expiryDate: date("expiry_date"),
  batchNumber: text("batch_number"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Feeding Events
export const feedingEvents = pgTable("feeding_events", {
  id: serial("id").primaryKey(),
  batch: integer("batch").references(() => batches.id).notNull(),
  feedType: integer("feed_type").references(() => feedTypes.id).notNull(),
  quantityKg: decimal("quantity_kg", { precision: 8, scale: 2 }).notNull(),
  feedingTime: timestamp("feeding_time").notNull(),
  feeder: text("feeder").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Health Records
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

export const insertFeedInventorySchema = createInsertSchema(feedInventory).omit({
  id: true,
  updatedAt: true,
});

export const insertFeedingEventSchema = createInsertSchema(feedingEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHealthRecordSchema = createInsertSchema(healthRecords).omit({
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

export type FeedInventory = typeof feedInventory.$inferSelect;
export type InsertFeedInventory = z.infer<typeof insertFeedInventorySchema>;

export type FeedingEvent = typeof feedingEvents.$inferSelect;
export type InsertFeedingEvent = z.infer<typeof insertFeedingEventSchema>;

export type HealthRecord = typeof healthRecords.$inferSelect;
export type InsertHealthRecord = z.infer<typeof insertHealthRecordSchema>;

// Legacy compatibility types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type FarmSite = typeof farmSites.$inferSelect;
export type InsertFarmSite = z.infer<typeof insertFarmSiteSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;