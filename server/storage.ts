import { 
  users, farmSites, pens, alerts, environmentalParameters, containers, sensors, 
  environmentalReadings, batches, feedTypes, feedInventory, feedingEvents, healthRecords,
  feedPurchases, feedContainers, feedContainerStock, batchFeedingSummaries,
  species, stages, labSamples, healthAssessments, weatherData, broodstockPairs, eggSuppliers,
  type User, type InsertUser, type FarmSite, type InsertFarmSite,
  type Pen, type InsertPen, type Alert, type InsertAlert, 
  type EnvironmentalParameter, type InsertEnvironmentalParameter,
  type Container, type InsertContainer, type Sensor, type InsertSensor,
  type EnvironmentalReading, type InsertEnvironmentalReading, type Batch, type InsertBatch,
  type FeedType, type InsertFeedType, type FeedInventory, type InsertFeedInventory,
  type FeedingEvent, type InsertFeedingEvent, type HealthRecord, type InsertHealthRecord,
  type FeedPurchase, type InsertFeedPurchase, type FeedContainer, type InsertFeedContainer,
  type FeedContainerStock, type InsertFeedContainerStock, type BatchFeedingSummary, type InsertBatchFeedingSummary,
  type Species, type InsertSpecies, type Stage, type InsertStage,
  type LabSample, type InsertLabSample, type HealthAssessment, type InsertHealthAssessment,
  type WeatherData, type InsertWeatherData, type BroodstockPair, type InsertBroodstockPair,
  type EggSupplier, type InsertEggSupplier
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

  // Broodstock Management
  getBroodstockPairs(): Promise<BroodstockPair[]>;
  createBroodstockPair(pair: InsertBroodstockPair): Promise<BroodstockPair>;
  getEggSuppliers(): Promise<EggSupplier[]>;
  createEggSupplier(supplier: InsertEggSupplier): Promise<EggSupplier>;

  // Legacy compatibility for current frontend
  getFarmSites(): Promise<FarmSite[]>;
  getFarmSite(id: number): Promise<FarmSite | undefined>;
  createFarmSite(farmSite: InsertFarmSite): Promise<FarmSite>;
  updateFarmSite(id: number, farmSite: Partial<InsertFarmSite>): Promise<FarmSite>;

  // Pen management
  getPensByFarmSite(farmSiteId: number): Promise<Pen[]>;
  getPen(id: number): Promise<Pen | undefined>;
  createPen(pen: InsertPen): Promise<Pen>;

  getActiveAlerts(): Promise<Alert[]>;
  getAlerts(limit?: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: number): Promise<Alert>;

  // Health Management API
  getHealthSummary(): Promise<{
    totalBatches: number;
    healthyBatches: number;
    batchesUnderTreatment: number;
    averageHealthScore: number;
    recentMortality: number;
    activeTreatments: number;
    pendingReviews: number;
    avgLiceCount: number;
  }>;
  getHealthJournalEntries(limit?: number): Promise<any[]>;
  getCriticalHealthAlerts(): Promise<any[]>;
  getActiveTreatments(): Promise<any[]>;
  getRecentMortalityRecords(): Promise<any[]>;
  getRecentLiceCounts(): Promise<any[]>;

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
  
  // Broodstock Management
  private broodstockPairs: Map<number, BroodstockPair> = new Map();
  private eggSuppliers: Map<number, EggSupplier> = new Map();
  
  // Health Management data stores
  private healthJournalEntries: Map<number, any> = new Map();
  private healthParameters: Map<number, any> = new Map();
  private mortalityRecords: Map<number, any> = new Map();
  private liceCounts: Map<number, any> = new Map();
  private treatments: Map<number, any> = new Map();
  
  // Legacy compatibility
  private farmSites: Map<number, FarmSite> = new Map();
  private pens: Map<number, Pen> = new Map();
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

    // Seed Containers - Create diverse container types for different stages
    const containers: Container[] = [];
    
    // Sea cages for adult/post-smolt stages
    for (let i = 1; i <= 25; i++) {
      const container: Container = {
        id: this.currentId++,
        name: `Sea Cage ${String(i).padStart(2, '0')} - Atlantic`,
        containerType: "sea_cage",
        capacity: 200000, // Large capacity for adult fish
        location: i <= 12 ? "Faroe Islands" : "Scotland",
        coordinates: i <= 12 ? "62.0000,-6.7833" : "57.0000,-5.5000",
        depth: "35.00",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      containers.push(container);
      this.containers.set(container.id, container);
    }
    
    // Land-based tanks for smolt/parr/fry stages
    for (let i = 1; i <= 30; i++) {
      const container: Container = {
        id: this.currentId++,
        name: `Tank ${String(i).padStart(2, '0')} - Freshwater`,
        containerType: "tank",
        capacity: 50000, // Medium capacity for juvenile fish
        location: i <= 15 ? "Bakkafrost Hatchery A" : "Bakkafrost Hatchery B",
        coordinates: i <= 15 ? "62.0167,-6.7667" : "62.0333,-6.8000",
        depth: "8.00",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      containers.push(container);
      this.containers.set(container.id, container);
    }
    
    // Incubation systems for egg/alevin stages
    for (let i = 1; i <= 20; i++) {
      const container: Container = {
        id: this.currentId++,
        name: `Incubator ${String(i).padStart(2, '0')} - Controlled`,
        containerType: "incubator",
        capacity: 4000000, // Very high capacity for eggs
        location: "Bakkafrost Broodstock Facility",
        coordinates: "62.0500,-6.7500",
        depth: "2.00",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      containers.push(container);
      this.containers.set(container.id, container);
    }
    
    const container1 = containers[0];
    const container2 = containers[1];

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

    // Seed Stages - Complete Atlantic Salmon lifecycle
    const eggStage: Stage = {
      id: this.currentId++,
      name: "Egg",
      description: "Fertilized eggs in incubation",
      species: atlanticSalmon.id,
      durationDays: 90,
      feedingFrequency: 0,
      feedPercentage: "0.00",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stages.set(eggStage.id, eggStage);

    const fryStage: Stage = {
      id: this.currentId++,
      name: "Fry",
      description: "Newly hatched salmon with yolk sac",
      species: atlanticSalmon.id,
      durationDays: 60,
      feedingFrequency: 8,
      feedPercentage: "8.00",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stages.set(fryStage.id, fryStage);

    const parrStage: Stage = {
      id: this.currentId++,
      name: "Parr",
      description: "Juvenile salmon in freshwater",
      species: atlanticSalmon.id,
      durationDays: 365,
      feedingFrequency: 6,
      feedPercentage: "4.00",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stages.set(parrStage.id, parrStage);

    const smoltStage: Stage = {
      id: this.currentId++,
      name: "Smolt",
      description: "Juvenile salmon ready for seawater",
      species: atlanticSalmon.id,
      durationDays: 90,
      feedingFrequency: 4,
      feedPercentage: "3.50",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stages.set(smoltStage.id, smoltStage);

    const postSmoltStage: Stage = {
      id: this.currentId++,
      name: "Post-Smolt",
      description: "Young salmon in seawater",
      species: atlanticSalmon.id,
      durationDays: 180,
      feedingFrequency: 4,
      feedPercentage: "2.50",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stages.set(postSmoltStage.id, postSmoltStage);

    const adultStage: Stage = {
      id: this.currentId++,
      name: "Adult",
      description: "Mature salmon ready for harvest",
      species: atlanticSalmon.id,
      durationDays: 365,
      feedingFrequency: 3,
      feedPercentage: "1.50",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stages.set(adultStage.id, adultStage);

    // Broodstock pairs
    const pair1: BroodstockPair = {
      id: this.currentId++,
      pairName: "P456-Atlantic-Elite",
      maleFishId: "BM-2023-001",
      femaleFishId: "BF-2023-007", 
      pairingDate: "2023-10-01",
      progenyCount: 75000,
      geneticTraits: JSON.stringify({
        growthRate: 0.85,
        diseaseResistance: 0.92,
        coldTolerance: 0.78
      }),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const pair2: BroodstockPair = {
      id: this.currentId++,
      pairName: "P789-Atlantic-Premium",
      maleFishId: "BM-2023-003",
      femaleFishId: "BF-2023-012",
      pairingDate: "2023-11-15",
      progenyCount: 68000,
      geneticTraits: JSON.stringify({
        growthRate: 0.91,
        diseaseResistance: 0.87,
        coldTolerance: 0.83
      }),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Egg suppliers
    const supplier1: EggSupplier = {
      id: this.currentId++,
      name: "AquaGen Nordic AS",
      contactInfo: "contact@aquagen-nordic.no, +47 12345678",
      certifications: "ASC, GlobalGAP, ISO 14001",
      country: "Norway",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const supplier2: EggSupplier = {
      id: this.currentId++,
      name: "Benchmark Genetics Scotland",
      contactInfo: "info@benchmarkgenetics.com, +44 1234 567890",
      certifications: "RSPCA Assured, ASC",
      country: "Scotland",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.broodstockPairs.set(pair1.id, pair1);
    this.broodstockPairs.set(pair2.id, pair2);
    this.eggSuppliers.set(supplier1.id, supplier1);
    this.eggSuppliers.set(supplier2.id, supplier2);

    // Create realistic batch data representing 75 active batches across lifecycle stages
    // Based on ~3.5M eggs initial, 20-25% mortality, production targeting 100,000 tons annually
    
    const batchTemplates = [
      // Adult stage batches (sea cages) - 450+ days, highest biomass
      { stage: adultStage, ageMonths: 18, mortality: 0.25, avgWeightG: 4500, stagePrefix: "AD" },
      { stage: adultStage, ageMonths: 17, mortality: 0.24, avgWeightG: 4200, stagePrefix: "AD" },
      { stage: adultStage, ageMonths: 16, mortality: 0.23, avgWeightG: 3800, stagePrefix: "AD" },
      { stage: adultStage, ageMonths: 15, mortality: 0.22, avgWeightG: 3400, stagePrefix: "AD" },
      { stage: adultStage, ageMonths: 14, mortality: 0.21, avgWeightG: 3000, stagePrefix: "AD" },
      
      // Post-smolt stage (90-100 days) - rapid growth phase
      { stage: postSmoltStage, ageMonths: 6, mortality: 0.20, avgWeightG: 800, stagePrefix: "PS" },
      { stage: postSmoltStage, ageMonths: 5, mortality: 0.19, avgWeightG: 600, stagePrefix: "PS" },
      { stage: postSmoltStage, ageMonths: 4, mortality: 0.18, avgWeightG: 400, stagePrefix: "PS" },
      
      // Smolt stage (90-100 days) - pre-seawater transfer
      { stage: smoltStage, ageMonths: 3, mortality: 0.17, avgWeightG: 180, stagePrefix: "SM" },
      { stage: smoltStage, ageMonths: 3, mortality: 0.16, avgWeightG: 160, stagePrefix: "SM" },
      { stage: smoltStage, ageMonths: 3, mortality: 0.15, avgWeightG: 140, stagePrefix: "SM" },
      
      // Parr stage (90-100 days) - freshwater growth
      { stage: parrStage, ageMonths: 2, mortality: 0.14, avgWeightG: 45, stagePrefix: "PR" },
      { stage: parrStage, ageMonths: 2, mortality: 0.13, avgWeightG: 35, stagePrefix: "PR" },
      { stage: parrStage, ageMonths: 1, mortality: 0.12, avgWeightG: 25, stagePrefix: "PR" },
      
      // Fry stage (60-90 days) - early development
      { stage: fryStage, ageMonths: 1, mortality: 0.11, avgWeightG: 8, stagePrefix: "FR" },
      { stage: fryStage, ageMonths: 1, mortality: 0.10, avgWeightG: 5, stagePrefix: "FR" },
      
      // Egg/Alevin stage (90-100 days) - highest mortality
      { stage: eggStage, ageMonths: 0, mortality: 0.08, avgWeightG: 0.1, stagePrefix: "EG" },
      { stage: eggStage, ageMonths: 0, mortality: 0.07, avgWeightG: 0.08, stagePrefix: "EG" },
    ];

    // Generate 75 batches with realistic progression
    const batches: Batch[] = [];
    let batchCounter = 1;
    
    for (let i = 0; i < 75; i++) {
      const template = batchTemplates[i % batchTemplates.length];
      const baseDate = new Date();
      baseDate.setMonth(baseDate.getMonth() - template.ageMonths);
      
      const initialCount = 3500000; // 3.5M eggs
      const currentCount = Math.floor(initialCount * (1 - template.mortality));
      const currentBiomassKg = (currentCount * template.avgWeightG / 1000).toFixed(2);
      const initialBiomassKg = template.stage.name === "Egg" ? "0.35" : (initialCount * 0.1 / 1000).toFixed(2);
      
      const harvestDate = new Date(baseDate);
      harvestDate.setMonth(harvestDate.getMonth() + 24); // 2 years total cycle
      
      const isInternal = Math.random() > 0.3; // 70% internal, 30% external
      const selectedPair = Math.random() > 0.5 ? pair1 : pair2;
      const selectedSupplier = Math.random() > 0.5 ? supplier1 : supplier2;
      
      const batch: Batch = {
        id: this.currentId++,
        name: `BATCH-2024-${String(batchCounter).padStart(3, '0')}`,
        species: atlanticSalmon.id,
        startDate: baseDate.toISOString().split('T')[0],
        initialCount,
        initialBiomassKg,
        currentCount,
        currentBiomassKg,
        container: containers[i % containers.length].id, // Distribute across containers
        stage: template.stage.id,
        status: template.stage.name === "Adult" && template.ageMonths >= 18 ? "harvested" : "active",
        expectedHarvestDate: harvestDate.toISOString().split('T')[0],
        notes: `${template.stage.name} stage batch - Day ${template.ageMonths * 30}`,
        eggSource: isInternal ? "internal" : "external",
        broodstockPairId: isInternal ? selectedPair.id : null,
        eggSupplierId: isInternal ? null : selectedSupplier.id,
        eggBatchNumber: isInternal ? null : `${selectedSupplier.name.split(' ')[0].toUpperCase()}-2024-E${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
        eggProductionDate: baseDate.toISOString().split('T')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      batches.push(batch);
      this.batches.set(batch.id, batch);
      batchCounter++;
    }

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

    // Generate health records for first 20 batches
    const firstBatches = batches.slice(0, 20);
    firstBatches.forEach(batch => {
      const healthRecord: HealthRecord = {
        id: this.currentId++,
        batch: batch.id,
        checkDate: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString().split('T')[0],
        healthStatus: Math.random() > 0.1 ? "healthy" : "under_observation",
        notes: "Regular health check - monitoring growth and mortality",
        veterinarian: Math.random() > 0.5 ? "Dr. Sarah Mitchell" : "Dr. Erik Hansen",
        mortalityCount: Math.floor(Math.random() * 50),
        averageWeight: (Math.random() * 3 + 0.5).toFixed(2),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.healthRecords.set(healthRecord.id, healthRecord);
    });

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

    // Generate feeding events for active batches
    batches.slice(0, 30).forEach((batch, index) => {
      for (let day = 0; day < 7; day++) {
        const feedingEvent: FeedingEvent = {
          id: this.currentId++,
          batch: batch.id,
          container: batch.container || container1.id,
          feed: feedType1.id,
          feedingDate: new Date(Date.now() - day * 24 * 3600000).toISOString().split('T')[0],
          feedingTime: `${8 + (day % 3) * 4}:00`,
          amountKg: (100 + Math.random() * 300).toFixed(2),
          batchBiomassKg: batch.currentBiomassKg,
          feedCost: (250 + Math.random() * 500).toFixed(2),
          method: Math.random() > 0.3 ? "automatic" : "manual",
          recordedBy: user1.id,
          notes: day === 0 ? "Recent feeding cycle" : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.feedingEvents.set(feedingEvent.id, feedingEvent);
      }
    });

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

    // Seed Pens - Add containment units to farm sites
    const pen1: Pen = {
      id: this.currentId++,
      name: "Pen A1",
      farmSiteId: site1.id,
      capacity: 15000,
      currentStock: 14250,
      depth: "18.5",
      coordinates: "61.9167,5.7333",
      status: "active",
      healthStatus: "optimal",
      lastInspection: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const pen2: Pen = {
      id: this.currentId++,
      name: "Pen A2",
      farmSiteId: site1.id,
      capacity: 15000,
      currentStock: 13800,
      depth: "20.0",
      coordinates: "61.9170,5.7330",
      status: "active",
      healthStatus: "good",
      lastInspection: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const pen3: Pen = {
      id: this.currentId++,
      name: "Pen B1",
      farmSiteId: site2.id,
      capacity: 20000,
      currentStock: 19500,
      depth: "22.5",
      coordinates: "61.2181,7.1250",
      status: "active",
      healthStatus: "optimal",
      lastInspection: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.pens.set(pen1.id, pen1);
    this.pens.set(pen2.id, pen2);
    this.pens.set(pen3.id, pen3);

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

    // Seed Health Parameters
    const finConditionParam = {
      id: this.currentId++,
      name: "Fin Condition",
      description: "Assessment of fin integrity and damage",
      minValue: 1,
      maxValue: 5,
      unit: "score",
      category: "physical",
    };
    this.healthParameters.set(finConditionParam.id, finConditionParam);

    const skinConditionParam = {
      id: this.currentId++,
      name: "Skin Condition", 
      description: "Assessment of skin lesions and pigmentation",
      minValue: 1,
      maxValue: 5,
      unit: "score",
      category: "physical",
    };
    this.healthParameters.set(skinConditionParam.id, skinConditionParam);

    // Generate health journal entries for batches
    batches.slice(0, 25).forEach((batch, index) => {
      const journalEntry = {
        id: this.currentId++,
        batch: batch.id,
        container: batch.container,
        entryDate: new Date(Date.now() - Math.random() * 14 * 24 * 3600000).toISOString().split('T')[0],
        observations: [
          "Fish showing excellent appetite and normal swimming behavior",
          "Minor fin damage observed in small population percentage",
          "Growth rates within expected parameters for this stage",
          "All health indicators within normal ranges",
          "Recommending continuation of current protocols"
        ][index % 5],
        veterinarian: ["Dr. Emma Nordström", "Dr. Lars Andersen", "Dr. Sarah Mitchell"][index % 3],
        healthStatus: Math.random() > 0.2 ? "good" : "excellent",
        flaggedForReview: Math.random() < 0.1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.healthJournalEntries.set(journalEntry.id, journalEntry);
    });

    // Generate mortality records, lice counts, and treatments for batches
    batches.slice(0, 15).forEach((batch, index) => {
      const mortalityRecord = {
        id: this.currentId++,
        batch: batch.id,
        container: batch.container || container1.id,
        date: new Date(Date.now() - Math.random() * 21 * 24 * 3600000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 30) + 5,
        reason: ["Natural mortality", "Environmental stress", "Handling mortality"][index % 3],
        notes: "Within expected range for this stage",
        reportedBy: `Field Operator ${["Hansen", "Olsen", "Larsen"][index % 3]}`,
        veterinarianReview: true,
      };
      this.mortalityRecords.set(mortalityRecord.id, mortalityRecord);

      const liceCount = {
        id: this.currentId++,
        batch: batch.id,
        container: batch.container || container1.id,
        countDate: new Date(Date.now() - Math.random() * 14 * 24 * 3600000).toISOString().split('T')[0],
        adultFemale: Math.floor(Math.random() * 3) + 1,
        adultMale: Math.floor(Math.random() * 2) + 1,
        juvenile: Math.floor(Math.random() * 5) + 2,
        countedBy: ["QA Specialist Johansen", "QA Specialist Nielsen", "QA Specialist Andersen"][index % 3],
      };
      this.liceCounts.set(liceCount.id, liceCount);

      if (index % 8 === 0) { // Some batches have treatments
        const treatment = {
          id: this.currentId++,
          batch: batch.id,
          container: batch.container || container1.id,
          treatmentType: ["Preventive", "Therapeutic", "Emergency"][index % 3],
          medication: ["Slice (emamectin benzoate)", "AlphaMax (deltamethrin)", "Salmosan (azamethiphos)"][index % 3],
          dosage: ["50 μg/kg", "2 μg/L", "0.1 mg/L"][index % 3],
          startDate: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString().split('T')[0],
          endDate: new Date(Date.now() - Math.random() * 23 * 24 * 3600000).toISOString().split('T')[0],
          veterinarian: ["Dr. Emma Nordström", "Dr. Lars Andersen", "Dr. Sarah Mitchell"][index % 3],
          reason: "Preventive lice treatment",
          effectiveness: ["excellent", "good", "fair"][index % 3],
          notes: "Treatment completed successfully with no adverse effects",
        };
        this.treatments.set(treatment.id, treatment);
      }
    });
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

  // Pen management methods
  async getPensByFarmSite(farmSiteId: number): Promise<Pen[]> {
    return Array.from(this.pens.values()).filter(pen => pen.farmSiteId === farmSiteId);
  }

  async getPen(id: number): Promise<Pen | undefined> {
    return this.pens.get(id);
  }

  async createPen(insertPen: InsertPen): Promise<Pen> {
    const pen: Pen = {
      id: this.currentId++,
      ...insertPen,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.pens.set(pen.id, pen);
    return pen;
  }

  // Health Management API implementation
  async getHealthSummary() {
    const totalBatches = this.batches.size;
    const healthyBatches = Math.floor(totalBatches * 0.87); // 87% healthy
    const batchesUnderTreatment = this.treatments.size;
    const averageHealthScore = 4.2;
    const recentMortality = 1.2;
    const activeTreatments = this.treatments.size;
    const pendingReviews = Math.floor(this.healthJournalEntries.size * 0.1);
    const avgLiceCount = 2.3;

    return {
      totalBatches,
      healthyBatches,
      batchesUnderTreatment,
      averageHealthScore,
      recentMortality,
      activeTreatments,
      pendingReviews,
      avgLiceCount,
    };
  }

  async getHealthJournalEntries(limit = 50): Promise<any[]> {
    const entries = Array.from(this.healthJournalEntries.values());
    return entries.slice(0, limit);
  }

  async getCriticalHealthAlerts(): Promise<any[]> {
    return Array.from(this.mortalityRecords.values()).filter(
      (record: any) => record.count > 20 && !record.veterinarianReview
    );
  }

  async getActiveTreatments(): Promise<any[]> {
    return Array.from(this.treatments.values()).filter(
      (treatment: any) => !treatment.endDate
    );
  }

  async getRecentMortalityRecords(): Promise<any[]> {
    const recent = Array.from(this.mortalityRecords.values());
    return recent.slice(0, 5);
  }

  async getRecentLiceCounts(): Promise<any[]> {
    const recent = Array.from(this.liceCounts.values());
    return recent.slice(0, 5);
  }

  // Broodstock Management methods
  async getBroodstockPairs(): Promise<BroodstockPair[]> {
    return Array.from(this.broodstockPairs.values());
  }

  async createBroodstockPair(insertPair: InsertBroodstockPair): Promise<BroodstockPair> {
    const pair: BroodstockPair = {
      id: this.currentId++,
      ...insertPair,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.broodstockPairs.set(pair.id, pair);
    return pair;
  }

  async getEggSuppliers(): Promise<EggSupplier[]> {
    return Array.from(this.eggSuppliers.values());
  }

  async createEggSupplier(insertSupplier: InsertEggSupplier): Promise<EggSupplier> {
    const supplier: EggSupplier = {
      id: this.currentId++,
      ...insertSupplier,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.eggSuppliers.set(supplier.id, supplier);
    return supplier;
  }
}

export const storage = new MemStorage();