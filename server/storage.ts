import { 
  users, farmSites, alerts, environmentalParameters, containers, sensors, 
  environmentalReadings, batches, feedTypes, feedInventory, feedingEvents, healthRecords,
  feedPurchases, feedContainers, feedContainerStock, batchFeedingSummaries,
  species, stages, labSamples, healthAssessments, weatherData,
  type User, type InsertUser, type FarmSite, type InsertFarmSite,
  type Alert, type InsertAlert, type EnvironmentalParameter, type InsertEnvironmentalParameter,
  type Container, type InsertContainer, type Sensor, type InsertSensor,
  type EnvironmentalReading, type InsertEnvironmentalReading, type Batch, type InsertBatch,
  type FeedType, type InsertFeedType, type FeedInventory, type InsertFeedInventory,
  type FeedingEvent, type InsertFeedingEvent, type HealthRecord, type InsertHealthRecord,
  type FeedPurchase, type InsertFeedPurchase, type FeedContainer, type InsertFeedContainer,
  type FeedContainerStock, type InsertFeedContainerStock, type BatchFeedingSummary, type InsertBatchFeedingSummary,
  type Species, type InsertSpecies, type Stage, type InsertStage,
  type LabSample, type InsertLabSample, type HealthAssessment, type InsertHealthAssessment,
  type WeatherData, type InsertWeatherData
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

  // FIFO Feed Management System
  getFeedPurchases(): Promise<FeedPurchase[]>;
  createFeedPurchase(purchase: InsertFeedPurchase): Promise<FeedPurchase>;
  getFeedContainers(): Promise<FeedContainer[]>;
  createFeedContainer(container: InsertFeedContainer): Promise<FeedContainer>;
  getFeedContainerStock(containerId?: number): Promise<FeedContainerStock[]>;
  getFeedContainerStockInFifoOrder(containerId: number): Promise<FeedContainerStock[]>;
  addFeedToContainer(containerId: number, purchaseId: number, quantityKg: number): Promise<FeedContainerStock>;
  getBatchFeedingSummaries(batchId?: number): Promise<BatchFeedingSummary[]>;
  generateBatchFeedingSummary(batchId: number, periodStart: string, periodEnd: string): Promise<BatchFeedingSummary>;

  // Django API endpoints - Health Records
  getHealthRecords(): Promise<HealthRecord[]>;
  createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord>;

  // Django API endpoints - Species and Stages
  getSpecies(): Promise<Species[]>;
  createSpecies(species: InsertSpecies): Promise<Species>;
  getStages(speciesId?: number): Promise<Stage[]>;
  createStage(stage: InsertStage): Promise<Stage>;

  // Django API endpoints - Health Management
  getLabSamples(batchId?: number): Promise<LabSample[]>;
  createLabSample(sample: InsertLabSample): Promise<LabSample>;
  getHealthAssessments(batchId?: number): Promise<HealthAssessment[]>;
  createHealthAssessment(assessment: InsertHealthAssessment): Promise<HealthAssessment>;

  // Django API endpoints - Environmental Weather
  getWeatherData(limit?: number): Promise<WeatherData[]>;
  createWeatherData(weather: InsertWeatherData): Promise<WeatherData>;

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
  
  // FIFO Feed Management System
  private feedPurchases: Map<number, FeedPurchase> = new Map();
  private feedContainers: Map<number, FeedContainer> = new Map();
  private feedContainerStock: Map<number, FeedContainerStock> = new Map();
  private batchFeedingSummaries: Map<number, BatchFeedingSummary> = new Map();
  
  // Django API Models
  private species: Map<number, Species> = new Map();
  private stages: Map<number, Stage> = new Map();
  private labSamples: Map<number, LabSample> = new Map();
  private healthAssessments: Map<number, HealthAssessment> = new Map();
  private weatherData: Map<number, WeatherData> = new Map();
  
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

    // Seed Species first
    const atlanticSalmon: Species = {
      id: this.currentId++,
      name: "Atlantic Salmon",
      scientificName: "Salmo salar",
      description: "Primary aquaculture species in Norwegian fjords",
      averageWeightAtHarvest: "4000.00",
      typicalGrowthCycle: 540,
      optimalTemperatureMin: "8.00",
      optimalTemperatureMax: "16.00",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.species.set(atlanticSalmon.id, atlanticSalmon);

    // Seed Stages
    const juvenileStage: Stage = {
      id: this.currentId++,
      name: "Juvenile",
      description: "Post-smolt stage in sea water",
      species: atlanticSalmon.id,
      durationDays: 180,
      feedingFrequency: 4,
      feedPercentage: "2.50",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stages.set(juvenileStage.id, juvenileStage);

    // Seed Batches with proper foreign keys
    const batch1: Batch = {
      id: this.currentId++,
      name: "Batch 2024-001",
      species: atlanticSalmon.id,
      startDate: "2024-01-15",
      initialCount: 2500,
      initialBiomassKg: "5000.00",
      currentCount: 2140,
      currentBiomassKg: "6848.00",
      container: container1.id,
      stage: juvenileStage.id,
      status: "active",
      expectedHarvestDate: "2025-07-15",
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.batches.set(batch1.id, batch1);

    const batch2: Batch = {
      id: this.currentId++,
      name: "Batch 2024-002",
      species: atlanticSalmon.id,
      startDate: "2024-02-01",
      initialCount: 2200,
      initialBiomassKg: "4400.00",
      currentCount: 1890,
      currentBiomassKg: "5565.50",
      container: container2.id,
      stage: juvenileStage.id,
      status: "active",
      expectedHarvestDate: "2025-08-01",
      notes: null,
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

    // Seed FIFO Feed System Data
    const feedPurchase1: FeedPurchase = {
      id: this.currentId++,
      feed: feedType1.id,
      supplier: "Biomar Norway AS",
      batchNumber: "BM-2024-Q2-001",
      quantityKg: "5000.000",
      costPerKg: "24.50",
      purchaseDate: "2024-05-01",
      expiryDate: "2025-05-01",
      notes: "Premium grade feed for Atlantic salmon",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.feedPurchases.set(feedPurchase1.id, feedPurchase1);

    const feedPurchase2: FeedPurchase = {
      id: this.currentId++,
      feed: feedType1.id,
      supplier: "Biomar Norway AS",
      batchNumber: "BM-2024-Q2-002", 
      quantityKg: "3500.000",
      costPerKg: "25.20",
      purchaseDate: "2024-05-15",
      expiryDate: "2025-05-15",
      notes: "Second batch with slight price increase",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.feedPurchases.set(feedPurchase2.id, feedPurchase2);

    const feedContainer1: FeedContainer = {
      id: this.currentId++,
      name: "Silo A1",
      capacity: "8000.000",
      location: "Site A - North Shore",
      containerType: "silo",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.feedContainers.set(feedContainer1.id, feedContainer1);

    const feedContainer2: FeedContainer = {
      id: this.currentId++,
      name: "Silo A2", 
      capacity: "8000.000",
      location: "Site A - North Shore",
      containerType: "silo",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.feedContainers.set(feedContainer2.id, feedContainer2);

    // Feed Container Stock (FIFO tracking)
    const stock1: FeedContainerStock = {
      id: this.currentId++,
      feedContainer: feedContainer1.id,
      feedPurchase: feedPurchase1.id,
      quantityKg: "2500.000",
      costPerKg: "24.50",
      purchaseDate: "2024-05-01",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.feedContainerStock.set(stock1.id, stock1);

    const stock2: FeedContainerStock = {
      id: this.currentId++,
      feedContainer: feedContainer1.id,
      feedPurchase: feedPurchase2.id,
      quantityKg: "1800.000",
      costPerKg: "25.20",
      purchaseDate: "2024-05-15",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.feedContainerStock.set(stock2.id, stock2);

    // Seed Feeding Events with enhanced fields
    const feedingEvent1: FeedingEvent = {
      id: this.currentId++,
      batch: batch1.id,
      container: container1.id,
      feed: feedType1.id,
      feedingDate: "2024-06-10",
      feedingTime: "08:00:00",
      amountKg: "45.50",
      batchBiomassKg: "6848.00",
      feedCost: "1114.75", // Auto-calculated: 45.50 * 24.50
      method: "MANUAL",
      notes: "Morning feeding completed successfully",
      recordedBy: user1.id,
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

  // FIFO Feed Management System Implementation
  async getFeedPurchases(): Promise<FeedPurchase[]> {
    return Array.from(this.feedPurchases.values());
  }

  async createFeedPurchase(purchase: InsertFeedPurchase): Promise<FeedPurchase> {
    const newPurchase: FeedPurchase = {
      id: this.currentId++,
      ...purchase,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.feedPurchases.set(newPurchase.id, newPurchase);
    return newPurchase;
  }

  async getFeedContainers(): Promise<FeedContainer[]> {
    return Array.from(this.feedContainers.values());
  }

  async createFeedContainer(container: InsertFeedContainer): Promise<FeedContainer> {
    const newContainer: FeedContainer = {
      id: this.currentId++,
      ...container,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.feedContainers.set(newContainer.id, newContainer);
    return newContainer;
  }

  async getFeedContainerStock(containerId?: number): Promise<FeedContainerStock[]> {
    const allStock = Array.from(this.feedContainerStock.values());
    if (containerId) {
      return allStock.filter(stock => stock.feedContainer === containerId);
    }
    return allStock;
  }

  async getFeedContainerStockInFifoOrder(containerId: number): Promise<FeedContainerStock[]> {
    const containerStock = await this.getFeedContainerStock(containerId);
    return containerStock.sort((a, b) => 
      new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
    );
  }

  async addFeedToContainer(containerId: number, purchaseId: number, quantityKg: number): Promise<FeedContainerStock> {
    const purchase = this.feedPurchases.get(purchaseId);
    if (!purchase) throw new Error('Feed purchase not found');

    const newStock: FeedContainerStock = {
      id: this.currentId++,
      feedContainer: containerId,
      feedPurchase: purchaseId,
      quantityKg: quantityKg.toString(),
      costPerKg: purchase.costPerKg,
      purchaseDate: purchase.purchaseDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.feedContainerStock.set(newStock.id, newStock);
    return newStock;
  }

  async getBatchFeedingSummaries(batchId?: number): Promise<BatchFeedingSummary[]> {
    const allSummaries = Array.from(this.batchFeedingSummaries.values());
    if (batchId) {
      return allSummaries.filter(summary => summary.batch === batchId);
    }
    return allSummaries;
  }

  async generateBatchFeedingSummary(batchId: number, periodStart: string, periodEnd: string): Promise<BatchFeedingSummary> {
    // Get feeding events for the batch in the period
    const feedingEvents = Array.from(this.feedingEvents.values())
      .filter(event => 
        event.batch === batchId &&
        event.feedingDate >= periodStart &&
        event.feedingDate <= periodEnd
      );

    const totalFeedKg = feedingEvents.reduce((sum, event) => sum + parseFloat(event.amountKg), 0);
    const totalFeedConsumedKg = totalFeedKg; // Assuming all feed is consumed
    
    // Calculate biomass gain (simplified calculation)
    const totalBiomassGainKg = totalFeedConsumedKg * 0.8; // Assume 80% conversion efficiency
    
    // Calculate FCR (Feed Conversion Ratio)
    const fcr = totalBiomassGainKg > 0 ? totalFeedConsumedKg / totalBiomassGainKg : 0;

    const newSummary: BatchFeedingSummary = {
      id: this.currentId++,
      batch: batchId,
      periodStart,
      periodEnd,
      totalFeedKg: totalFeedKg.toString(),
      totalFeedConsumedKg: totalFeedConsumedKg.toString(),
      totalBiomassGainKg: totalBiomassGainKg.toString(),
      fcr: fcr.toFixed(3),
      averageFeedingPercentage: "2.1",
      feedingEventsCount: feedingEvents.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.batchFeedingSummaries.set(newSummary.id, newSummary);
    return newSummary;
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

  // Django API implementations - Species and Stages
  async getSpecies(): Promise<Species[]> {
    return Array.from(this.species.values());
  }

  async createSpecies(insertSpecies: InsertSpecies): Promise<Species> {
    const species: Species = {
      id: this.currentId++,
      ...insertSpecies,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.species.set(species.id, species);
    return species;
  }

  async getStages(speciesId?: number): Promise<Stage[]> {
    const stages = Array.from(this.stages.values());
    return speciesId ? stages.filter(s => s.species === speciesId) : stages;
  }

  async createStage(insertStage: InsertStage): Promise<Stage> {
    const stage: Stage = {
      id: this.currentId++,
      ...insertStage,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stages.set(stage.id, stage);
    return stage;
  }

  // Django API implementations - Health Management
  async getLabSamples(batchId?: number): Promise<LabSample[]> {
    const samples = Array.from(this.labSamples.values());
    return batchId ? samples.filter(s => s.batch === batchId) : samples;
  }

  async createLabSample(insertSample: InsertLabSample): Promise<LabSample> {
    const sample: LabSample = {
      id: this.currentId++,
      ...insertSample,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.labSamples.set(sample.id, sample);
    return sample;
  }

  async getHealthAssessments(batchId?: number): Promise<HealthAssessment[]> {
    const assessments = Array.from(this.healthAssessments.values());
    return batchId ? assessments.filter(a => a.batch === batchId) : assessments;
  }

  async createHealthAssessment(insertAssessment: InsertHealthAssessment): Promise<HealthAssessment> {
    const assessment: HealthAssessment = {
      id: this.currentId++,
      ...insertAssessment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.healthAssessments.set(assessment.id, assessment);
    return assessment;
  }

  // Django API implementations - Environmental Weather
  async getWeatherData(limit = 50): Promise<WeatherData[]> {
    return Array.from(this.weatherData.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createWeatherData(insertWeather: InsertWeatherData): Promise<WeatherData> {
    const weather: WeatherData = {
      id: this.currentId++,
      ...insertWeather,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.weatherData.set(weather.id, weather);
    return weather;
  }
}

export const storage = new MemStorage();