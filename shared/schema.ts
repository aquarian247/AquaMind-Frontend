import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("farm_manager"),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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

export const pens = pgTable("pens", {
  id: serial("id").primaryKey(),
  penId: text("pen_id").notNull().unique(),
  farmSiteId: integer("farm_site_id").references(() => farmSites.id).notNull(),
  fishCount: integer("fish_count").notNull().default(0),
  biomass: decimal("biomass", { precision: 8, scale: 2 }).notNull().default("0.00"),
  healthStatus: text("health_status").notNull().default("healthy"),
  lastFed: timestamp("last_fed"),
  waterDepth: decimal("water_depth", { precision: 5, scale: 2 }),
  netCondition: text("net_condition").notNull().default("good"),
});

export const waterQualityReadings = pgTable("water_quality_readings", {
  id: serial("id").primaryKey(),
  farmSiteId: integer("farm_site_id").references(() => farmSites.id).notNull(),
  penId: integer("pen_id").references(() => pens.id),
  temperature: decimal("temperature", { precision: 4, scale: 2 }).notNull(),
  dissolvedOxygen: decimal("dissolved_oxygen", { precision: 4, scale: 2 }).notNull(),
  phLevel: decimal("ph_level", { precision: 3, scale: 2 }).notNull(),
  salinity: decimal("salinity", { precision: 4, scale: 2 }).notNull(),
  turbidity: decimal("turbidity", { precision: 5, scale: 2 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const fishHealthRecords = pgTable("fish_health_records", {
  id: serial("id").primaryKey(),
  penId: integer("pen_id").references(() => pens.id).notNull(),
  averageWeight: decimal("average_weight", { precision: 5, scale: 2 }).notNull(),
  mortalityCount: integer("mortality_count").notNull().default(0),
  healthScore: decimal("health_score", { precision: 3, scale: 2 }).notNull(),
  diseases: json("diseases").$type<string[]>().default([]),
  veterinaryNotes: text("veterinary_notes"),
  recordDate: timestamp("record_date").defaultNow().notNull(),
});

export const feedingRecords = pgTable("feeding_records", {
  id: serial("id").primaryKey(),
  penId: integer("pen_id").references(() => pens.id).notNull(),
  feedType: text("feed_type").notNull(),
  quantity: decimal("quantity", { precision: 8, scale: 2 }).notNull(),
  feedingTime: timestamp("feeding_time").notNull(),
  waterTemperature: decimal("water_temperature", { precision: 4, scale: 2 }),
  notes: text("notes"),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'water_quality', 'fish_health', 'system', 'feeding'
  severity: text("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  title: text("title").notNull(),
  description: text("description").notNull(),
  farmSiteId: integer("farm_site_id").references(() => farmSites.id),
  penId: integer("pen_id").references(() => pens.id),
  resolved: boolean("resolved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  metricType: text("metric_type").notNull(), // 'kpi', 'performance', 'environmental'
  name: text("name").notNull(),
  value: decimal("value", { precision: 10, scale: 4 }).notNull(),
  unit: text("unit").notNull(),
  farmSiteId: integer("farm_site_id").references(() => farmSites.id),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFarmSiteSchema = createInsertSchema(farmSites).omit({
  id: true,
  lastUpdate: true,
});

export const insertPenSchema = createInsertSchema(pens).omit({
  id: true,
});

export const insertWaterQualityReadingSchema = createInsertSchema(waterQualityReadings).omit({
  id: true,
  timestamp: true,
});

export const insertFishHealthRecordSchema = createInsertSchema(fishHealthRecords).omit({
  id: true,
  recordDate: true,
});

export const insertFeedingRecordSchema = createInsertSchema(feedingRecords).omit({
  id: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertSystemMetricSchema = createInsertSchema(systemMetrics).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type FarmSite = typeof farmSites.$inferSelect;
export type InsertFarmSite = z.infer<typeof insertFarmSiteSchema>;

export type Pen = typeof pens.$inferSelect;
export type InsertPen = z.infer<typeof insertPenSchema>;

export type WaterQualityReading = typeof waterQualityReadings.$inferSelect;
export type InsertWaterQualityReading = z.infer<typeof insertWaterQualityReadingSchema>;

export type FishHealthRecord = typeof fishHealthRecords.$inferSelect;
export type InsertFishHealthRecord = z.infer<typeof insertFishHealthRecordSchema>;

export type FeedingRecord = typeof feedingRecords.$inferSelect;
export type InsertFeedingRecord = z.infer<typeof insertFeedingRecordSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type SystemMetric = typeof systemMetrics.$inferSelect;
export type InsertSystemMetric = z.infer<typeof insertSystemMetricSchema>;
