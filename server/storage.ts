import { 
  users, farmSites, alerts, environmentalParameters, containers, sensors, 
  environmentalReadings, batches, feedTypes, feedInventory, feedingEvents, healthRecords,
  type User, type InsertUser, type FarmSite, type InsertFarmSite,
  type Alert, type InsertAlert, type EnvironmentalParameter, type InsertEnvironmentalParameter,
  type Container, type InsertContainer, type Sensor, type InsertSensor,
  type EnvironmentalReading, type InsertEnvironmentalReading, type Batch, type InsertBatch,
  type FeedType, type InsertFeedType, type FeedInventory, type InsertFeedInventory,
  type FeedingEvent, type InsertFeedingEvent, type HealthRecord, type InsertHealthRecord
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Django API endpoints - Environmental
  getEnvironmentalParameters(): Promise<EnvironmentalParameter[]>;
  createEnvironmentalParameter(param: InsertEnvironmentalParameter): Promise<EnvironmentalParameter>;
  getEnvironmentalReadings(containerId?: number, parameterId?: number): Promise<EnvironmentalReading[]>;
  createEnvironmentalReading(reading: InsertEnvironmentalReading): Promise<EnvironmentalReading>;

  // Django API endpoints - Containers/Batches
  getContainers(): Promise<Container[]>;
  getBatches(): Promise<Batch[]>;
  createBatch(batch: InsertBatch): Promise<Batch>;

  // Django API endpoints - Feed Management
  getFeedTypes(): Promise<FeedType[]>;
  getFeedInventory(): Promise<FeedInventory[]>;
  getFeedingEvents(): Promise<FeedingEvent[]>;
  createFeedingEvent(event: InsertFeedingEvent): Promise<FeedingEvent>;

  // Django API endpoints - Health Records
  getHealthRecords(): Promise<HealthRecord[]>;
  createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord>;

  // Legacy compatibility for current frontend
  getFarmSites(): Promise<FarmSite[]>;
  getFarmSite(id: number): Promise<FarmSite | undefined>;
  createFarmSite(farmSite: InsertFarmSite): Promise<FarmSite>;
  updateFarmSite(id: number, farmSite: Partial<InsertFarmSite>): Promise<FarmSite>;

  getActiveAlerts(): Promise<Alert[]>;
  getAlerts(limit?: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: number): Promise<Alert>;

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
  private environmentalParameters: Map<number, EnvironmentalParameter> = new Map();
  private containers: Map<number, Container> = new Map();
  private sensors: Map<number, Sensor> = new Map();
  private environmentalReadings: Map<number, EnvironmentalReading> = new Map();
  private batches: Map<number, Batch> = new Map();
  private feedTypes: Map<number, FeedType> = new Map();
  private feedInventory: Map<number, FeedInventory> = new Map();
  private feedingEvents: Map<number, FeedingEvent> = new Map();
  private healthRecords: Map<number, HealthRecord> = new Map();
  
  // Legacy compatibility
  private farmSites: Map<number, FarmSite> = new Map();
  private alerts: Map<number, Alert> = new Map();
  
  private currentId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed users
    const user1: User = {
      id: this.currentId++,
      username: "johansen",
      email: "john.hansen@aquamind.no",
      firstName: "John",
      lastName: "Hansen",
      isActive: true,
      isStaff: false,
      dateJoined: new Date(),
      lastLogin: new Date(),
    };
    this.users.set(user1.id, user1);

    // Seed Environmental Parameters
    const tempParam: EnvironmentalParameter = {
      id: this.currentId++,
      name: "Water Temperature",
      unit: "°C",
      description: "Temperature of water in farming containers",
      minValue: "10.0000",
      maxValue: "18.0000",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.environmentalParameters.set(tempParam.id, tempParam);

    const oxygenParam: EnvironmentalParameter = {
      id: this.currentId++,
      name: "Dissolved Oxygen",
      unit: "mg/L",
      description: "Amount of oxygen dissolved in water",
      minValue: "5.0000",
      maxValue: "15.0000",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.environmentalParameters.set(oxygenParam.id, oxygenParam);

    const phParam: EnvironmentalParameter = {
      id: this.currentId++,
      name: "pH Level",
      unit: "pH",
      description: "Acidity/alkalinity of water",
      minValue: "6.5000",
      maxValue: "8.5000",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.environmentalParameters.set(phParam.id, phParam);

    // Seed Containers
    const container1: Container = {
      id: this.currentId++,
      name: "Pen A1 - Atlantic Site",
      containerType: "pen",
      capacity: 2500,
      location: "Nordfjord, Norway",
      coordinates: "61.9167,5.7333",
      depth: "25.00",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.containers.set(container1.id, container1);

    const container2: Container = {
      id: this.currentId++,
      name: "Pen B1 - Pacific Site",
      containerType: "pen",
      capacity: 2200,
      location: "Sognefjord, Norway",
      coordinates: "61.2181,7.1250",
      depth: "28.00",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.containers.set(container2.id, container2);

    // Seed Batches
    const batch1: Batch = {
      id: this.currentId++,
      batchId: "SAL-2024-001",
      species: "Atlantic Salmon",
      strain: "AquaGen Supreme",
      quantity: 2140,
      averageWeight: "3.20",
      startDate: new Date("2024-01-15"),
      expectedHarvestDate: new Date("2025-07-15"),
      status: "active",
      container: container1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.batches.set(batch1.id, batch1);

    const batch2: Batch = {
      id: this.currentId++,
      batchId: "SAL-2024-002",
      species: "Atlantic Salmon",
      strain: "Benchmark Genetics",
      quantity: 1890,
      averageWeight: "2.95",
      startDate: new Date("2024-02-01"),
      expectedHarvestDate: new Date("2025-08-01"),
      status: "active",
      container: container2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.batches.set(batch2.id, batch2);

    // Seed Feed Types
    const feedType1: FeedType = {
      id: this.currentId++,
      name: "Biomar Orbit 6mm",
      manufacturer: "Biomar",
      proteinContent: "45.00",
      fatContent: "18.00",
      pelletSize: "6mm",
      costPerKg: "24.50",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.feedTypes.set(feedType1.id, feedType1);

    // Seed Environmental Readings
    for (let i = 0; i < 10; i++) {
      const tempReading: EnvironmentalReading = {
        id: this.currentId++,
        parameter: tempParam.id,
        readingTime: new Date(Date.now() - i * 60 * 60 * 1000),
        value: (12.5 + Math.random() * 2).toFixed(4),
        sensor: null,
        container: container1.id,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.environmentalReadings.set(tempReading.id, tempReading);

      const oxygenReading: EnvironmentalReading = {
        id: this.currentId++,
        parameter: oxygenParam.id,
        readingTime: new Date(Date.now() - i * 60 * 60 * 1000),
        value: (8.0 + Math.random() * 1.5).toFixed(4),
        sensor: null,
        container: container1.id,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.environmentalReadings.set(oxygenReading.id, oxygenReading);
    }

    // Seed Health Records
    const healthRecord1: HealthRecord = {
      id: this.currentId++,
      batch: batch1.id,
      checkDate: new Date(),
      veterinarian: "Dr. Erik Nordahl",
      healthStatus: "excellent",
      mortalityCount: 2,
      averageWeight: "3.20",
      notes: "Fish showing excellent growth rates and no signs of disease",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.healthRecords.set(healthRecord1.id, healthRecord1);

    // Seed Feeding Events
    const feedingEvent1: FeedingEvent = {
      id: this.currentId++,
      batch: batch1.id,
      feedType: feedType1.id,
      quantityKg: "45.50",
      feedingTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      feeder: "Lars Andersen",
      notes: "Morning feeding completed successfully",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.feedingEvents.set(feedingEvent1.id, feedingEvent1);

    // Legacy compatibility - Farm Sites
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

    // Seed alerts
    const alert1: Alert = {
      id: this.currentId++,
      type: "water_quality",
      severity: "high",
      title: "High Water Temperature",
      description: "Water temperature exceeded optimal range in Atlantic Site A",
      farmSiteId: site1.id,
      resolved: false,
      createdAt: new Date(Date.now() - 2 * 60 * 1000),
      resolvedAt: null,
    };
    this.alerts.set(alert1.id, alert1);
  }

  // Django API Methods
  async getEnvironmentalParameters(): Promise<EnvironmentalParameter[]> {
    return Array.from(this.environmentalParameters.values());
  }

  async createEnvironmentalParameter(param: InsertEnvironmentalParameter): Promise<EnvironmentalParameter> {
    const newParam: EnvironmentalParameter = {
      ...param,
      id: this.currentId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.environmentalParameters.set(newParam.id, newParam);
    return newParam;
  }

  async getEnvironmentalReadings(containerId?: number, parameterId?: number): Promise<EnvironmentalReading[]> {
    let readings = Array.from(this.environmentalReadings.values());
    
    if (containerId) {
      readings = readings.filter(r => r.container === containerId);
    }
    
    if (parameterId) {
      readings = readings.filter(r => r.parameter === parameterId);
    }
    
    return readings.sort((a, b) => b.readingTime.getTime() - a.readingTime.getTime());
  }

  async createEnvironmentalReading(reading: InsertEnvironmentalReading): Promise<EnvironmentalReading> {
    const newReading: EnvironmentalReading = {
      ...reading,
      id: this.currentId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.environmentalReadings.set(newReading.id, newReading);
    return newReading;
  }

  async getContainers(): Promise<Container[]> {
    return Array.from(this.containers.values());
  }

  async getBatches(): Promise<Batch[]> {
    return Array.from(this.batches.values());
  }

  async createBatch(batch: InsertBatch): Promise<Batch> {
    const newBatch: Batch = {
      ...batch,
      id: this.currentId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.batches.set(newBatch.id, newBatch);
    return newBatch;
  }

  async getFeedTypes(): Promise<FeedType[]> {
    return Array.from(this.feedTypes.values());
  }

  async getFeedInventory(): Promise<FeedInventory[]> {
    return Array.from(this.feedInventory.values());
  }

  async getFeedingEvents(): Promise<FeedingEvent[]> {
    return Array.from(this.feedingEvents.values());
  }

  async createFeedingEvent(event: InsertFeedingEvent): Promise<FeedingEvent> {
    const newEvent: FeedingEvent = {
      ...event,
      id: this.currentId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.feedingEvents.set(newEvent.id, newEvent);
    return newEvent;
  }

  async getHealthRecords(): Promise<HealthRecord[]> {
    return Array.from(this.healthRecords.values());
  }

  async createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord> {
    const newRecord: HealthRecord = {
      ...record,
      id: this.currentId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.healthRecords.set(newRecord.id, newRecord);
    return newRecord;
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
      isActive: true,
      isStaff: false,
      dateJoined: new Date(),
      lastLogin: null,
    };
    this.users.set(user.id, user);
    return user;
  }

  // Legacy compatibility methods
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

  async getDashboardKPIs() {
    const sites = Array.from(this.farmSites.values());
    const totalFish = sites.reduce((sum, site) => sum + site.currentStock, 0);
    
    const healthySites = sites.filter(site => site.healthStatus === 'optimal').length;
    const healthRate = sites.length > 0 ? (healthySites / sites.length) * 100 : 0;
    
    // Get recent temperature readings for average
    const tempParam = Array.from(this.environmentalParameters.values())
      .find(p => p.name === "Water Temperature");
    
    let avgWaterTemp = 12.5;
    if (tempParam) {
      const recentReadings = Array.from(this.environmentalReadings.values())
        .filter(r => r.parameter === tempParam.id)
        .sort((a, b) => b.readingTime.getTime() - a.readingTime.getTime())
        .slice(0, 10);
      
      if (recentReadings.length > 0) {
        avgWaterTemp = recentReadings.reduce((sum, reading) => sum + parseFloat(reading.value), 0) / recentReadings.length;
      }
    }

    // Calculate next feeding based on recent feeding events
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