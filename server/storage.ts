import { 
  users, farmSites, pens, waterQualityReadings, fishHealthRecords, 
  feedingRecords, alerts, systemMetrics,
  type User, type InsertUser, type FarmSite, type InsertFarmSite,
  type Pen, type InsertPen, type WaterQualityReading, type InsertWaterQualityReading,
  type FishHealthRecord, type InsertFishHealthRecord, type FeedingRecord, type InsertFeedingRecord,
  type Alert, type InsertAlert, type SystemMetric, type InsertSystemMetric
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Farm Sites
  getFarmSites(): Promise<FarmSite[]>;
  getFarmSite(id: number): Promise<FarmSite | undefined>;
  createFarmSite(farmSite: InsertFarmSite): Promise<FarmSite>;
  updateFarmSite(id: number, farmSite: Partial<InsertFarmSite>): Promise<FarmSite>;

  // Pens
  getPensByFarmSite(farmSiteId: number): Promise<Pen[]>;
  getPen(id: number): Promise<Pen | undefined>;
  createPen(pen: InsertPen): Promise<Pen>;
  updatePen(id: number, pen: Partial<InsertPen>): Promise<Pen>;

  // Water Quality
  getWaterQualityReadings(farmSiteId: number, limit?: number): Promise<WaterQualityReading[]>;
  createWaterQualityReading(reading: InsertWaterQualityReading): Promise<WaterQualityReading>;

  // Fish Health
  getFishHealthRecords(penId: number, limit?: number): Promise<FishHealthRecord[]>;
  createFishHealthRecord(record: InsertFishHealthRecord): Promise<FishHealthRecord>;

  // Feeding
  getFeedingRecords(penId: number, limit?: number): Promise<FeedingRecord[]>;
  createFeedingRecord(record: InsertFeedingRecord): Promise<FeedingRecord>;

  // Alerts
  getActiveAlerts(): Promise<Alert[]>;
  getAlerts(limit?: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: number): Promise<Alert>;

  // System Metrics
  getSystemMetrics(metricType?: string, farmSiteId?: number): Promise<SystemMetric[]>;
  createSystemMetric(metric: InsertSystemMetric): Promise<SystemMetric>;

  // Dashboard specific queries
  getDashboardKPIs(): Promise<{
    totalFish: number;
    healthRate: number;
    avgWaterTemp: number;
    nextFeedingHours: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private farmSites: Map<number, FarmSite> = new Map();
  private pens: Map<number, Pen> = new Map();
  private waterQualityReadings: Map<number, WaterQualityReading> = new Map();
  private fishHealthRecords: Map<number, FishHealthRecord> = new Map();
  private feedingRecords: Map<number, FeedingRecord> = new Map();
  private alerts: Map<number, Alert> = new Map();
  private systemMetrics: Map<number, SystemMetric> = new Map();
  
  private currentId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed users
    const user1: User = {
      id: this.currentId++,
      username: "johansen",
      password: "hashed_password",
      firstName: "John",
      lastName: "Hansen",
      role: "farm_manager",
      email: "john.hansen@aquamind.com",
      createdAt: new Date(),
    };
    this.users.set(user1.id, user1);

    // Seed farm sites
    const site1: FarmSite = {
      id: this.currentId++,
      name: "Atlantic Site A",
      location: "Nordfjord, Norway",
      coordinates: "61.9167,5.7333",
      status: "active",
      totalCapacity: 50000,
      currentStock: 42150,
      healthStatus: "optimal",
      lastUpdate: new Date(),
    };
    this.farmSites.set(site1.id, site1);

    const site2: FarmSite = {
      id: this.currentId++,
      name: "Pacific Site B",
      location: "Sognefjord, Norway",
      coordinates: "61.2181,7.1250",
      status: "active",
      totalCapacity: 45000,
      currentStock: 38920,
      healthStatus: "attention",
      lastUpdate: new Date(),
    };
    this.farmSites.set(site2.id, site2);

    const site3: FarmSite = {
      id: this.currentId++,
      name: "Arctic Site C",
      location: "Lofoten, Norway",
      coordinates: "68.1500,14.2167",
      status: "active",
      totalCapacity: 48000,
      currentStock: 44280,
      healthStatus: "optimal",
      lastUpdate: new Date(),
    };
    this.farmSites.set(site3.id, site3);

    // Seed pens
    const pen1: Pen = {
      id: this.currentId++,
      penId: "PEN-A1",
      farmSiteId: site1.id,
      fishCount: 2140,
      biomass: "6.80",
      healthStatus: "healthy",
      lastFed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      waterDepth: "25.00",
      netCondition: "good",
    };
    this.pens.set(pen1.id, pen1);

    // Seed alerts
    const alert1: Alert = {
      id: this.currentId++,
      type: "water_quality",
      severity: "high",
      title: "High Water Temperature",
      description: "Water temperature exceeded optimal range in Pen A3",
      farmSiteId: site1.id,
      penId: pen1.id,
      resolved: false,
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      resolvedAt: null,
    };
    this.alerts.set(alert1.id, alert1);

    // Seed water quality readings
    for (let i = 0; i < 7; i++) {
      const reading: WaterQualityReading = {
        id: this.currentId++,
        farmSiteId: site1.id,
        penId: pen1.id,
        temperature: (12.3 + Math.random() * 0.6).toFixed(2),
        dissolvedOxygen: (8.0 + Math.random() * 0.5).toFixed(2),
        phLevel: (7.6 + Math.random() * 0.4).toFixed(2),
        salinity: (34.0 + Math.random() * 0.5).toFixed(2),
        turbidity: (1.2 + Math.random() * 0.3).toFixed(2),
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      };
      this.waterQualityReadings.set(reading.id, reading);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Farm Site methods
  async getFarmSites(): Promise<FarmSite[]> {
    return Array.from(this.farmSites.values());
  }

  async getFarmSite(id: number): Promise<FarmSite | undefined> {
    return this.farmSites.get(id);
  }

  async createFarmSite(insertFarmSite: InsertFarmSite): Promise<FarmSite> {
    const farmSite: FarmSite = {
      ...insertFarmSite,
      id: this.currentId++,
      lastUpdate: new Date(),
    };
    this.farmSites.set(farmSite.id, farmSite);
    return farmSite;
  }

  async updateFarmSite(id: number, updates: Partial<InsertFarmSite>): Promise<FarmSite> {
    const existing = this.farmSites.get(id);
    if (!existing) throw new Error('Farm site not found');
    
    const updated: FarmSite = {
      ...existing,
      ...updates,
      lastUpdate: new Date(),
    };
    this.farmSites.set(id, updated);
    return updated;
  }

  // Pen methods
  async getPensByFarmSite(farmSiteId: number): Promise<Pen[]> {
    return Array.from(this.pens.values()).filter(pen => pen.farmSiteId === farmSiteId);
  }

  async getPen(id: number): Promise<Pen | undefined> {
    return this.pens.get(id);
  }

  async createPen(insertPen: InsertPen): Promise<Pen> {
    const pen: Pen = {
      ...insertPen,
      id: this.currentId++,
    };
    this.pens.set(pen.id, pen);
    return pen;
  }

  async updatePen(id: number, updates: Partial<InsertPen>): Promise<Pen> {
    const existing = this.pens.get(id);
    if (!existing) throw new Error('Pen not found');
    
    const updated: Pen = { ...existing, ...updates };
    this.pens.set(id, updated);
    return updated;
  }

  // Water Quality methods
  async getWaterQualityReadings(farmSiteId: number, limit = 50): Promise<WaterQualityReading[]> {
    return Array.from(this.waterQualityReadings.values())
      .filter(reading => reading.farmSiteId === farmSiteId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createWaterQualityReading(insertReading: InsertWaterQualityReading): Promise<WaterQualityReading> {
    const reading: WaterQualityReading = {
      ...insertReading,
      id: this.currentId++,
      timestamp: new Date(),
    };
    this.waterQualityReadings.set(reading.id, reading);
    return reading;
  }

  // Fish Health methods
  async getFishHealthRecords(penId: number, limit = 50): Promise<FishHealthRecord[]> {
    return Array.from(this.fishHealthRecords.values())
      .filter(record => record.penId === penId)
      .sort((a, b) => b.recordDate.getTime() - a.recordDate.getTime())
      .slice(0, limit);
  }

  async createFishHealthRecord(insertRecord: InsertFishHealthRecord): Promise<FishHealthRecord> {
    const record: FishHealthRecord = {
      ...insertRecord,
      id: this.currentId++,
      recordDate: new Date(),
    };
    this.fishHealthRecords.set(record.id, record);
    return record;
  }

  // Feeding methods
  async getFeedingRecords(penId: number, limit = 50): Promise<FeedingRecord[]> {
    return Array.from(this.feedingRecords.values())
      .filter(record => record.penId === penId)
      .sort((a, b) => b.feedingTime.getTime() - a.feedingTime.getTime())
      .slice(0, limit);
  }

  async createFeedingRecord(insertRecord: InsertFeedingRecord): Promise<FeedingRecord> {
    const record: FeedingRecord = {
      ...insertRecord,
      id: this.currentId++,
    };
    this.feedingRecords.set(record.id, record);
    return record;
  }

  // Alert methods
  async getActiveAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => !alert.resolved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAlerts(limit = 50): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const alert: Alert = {
      ...insertAlert,
      id: this.currentId++,
      createdAt: new Date(),
      resolvedAt: null,
    };
    this.alerts.set(alert.id, alert);
    return alert;
  }

  async resolveAlert(id: number): Promise<Alert> {
    const alert = this.alerts.get(id);
    if (!alert) throw new Error('Alert not found');
    
    const resolved: Alert = {
      ...alert,
      resolved: true,
      resolvedAt: new Date(),
    };
    this.alerts.set(id, resolved);
    return resolved;
  }

  // System Metrics methods
  async getSystemMetrics(metricType?: string, farmSiteId?: number): Promise<SystemMetric[]> {
    let metrics = Array.from(this.systemMetrics.values());
    
    if (metricType) {
      metrics = metrics.filter(metric => metric.metricType === metricType);
    }
    
    if (farmSiteId) {
      metrics = metrics.filter(metric => metric.farmSiteId === farmSiteId);
    }
    
    return metrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createSystemMetric(insertMetric: InsertSystemMetric): Promise<SystemMetric> {
    const metric: SystemMetric = {
      ...insertMetric,
      id: this.currentId++,
      timestamp: new Date(),
    };
    this.systemMetrics.set(metric.id, metric);
    return metric;
  }

  // Dashboard KPIs
  async getDashboardKPIs() {
    const sites = Array.from(this.farmSites.values());
    const totalFish = sites.reduce((sum, site) => sum + site.currentStock, 0);
    
    const healthySites = sites.filter(site => site.healthStatus === 'optimal').length;
    const healthRate = sites.length > 0 ? (healthySites / sites.length) * 100 : 0;
    
    // Get recent water quality readings for average temperature
    const recentReadings = Array.from(this.waterQualityReadings.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
    
    const avgWaterTemp = recentReadings.length > 0 
      ? recentReadings.reduce((sum, reading) => sum + parseFloat(reading.temperature), 0) / recentReadings.length
      : 12.5;

    // Mock next feeding calculation (would be based on feeding schedules)
    const nextFeedingHours = 2.5;

    return {
      totalFish,
      healthRate: Math.round(healthRate * 10) / 10,
      avgWaterTemp: Math.round(avgWaterTemp * 10) / 10,
      nextFeedingHours,
    };
  }
}

export const storage = new MemStorage();
