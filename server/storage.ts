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
  type EggSupplier, type InsertEggSupplier,
  type BatchContainerAssignment, type InsertBatchContainerAssignment,
  type BatchTransfer, type InsertBatchTransfer,
  type GrowthSample, type InsertGrowthSample,
  type MortalityEvent, type InsertMortalityEvent
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

  // Complex Batch Tracking
  getBatchContainerAssignments(batchId?: number): Promise<any[]>;
  createBatchContainerAssignment(assignment: any): Promise<any>;
  getBatchTransfers(batchId?: number): Promise<any[]>;
  createBatchTransfer(transfer: any): Promise<any>;
  getGrowthSamples(assignmentId?: number): Promise<any[]>;
  createGrowthSample(sample: any): Promise<any>;
  getMortalityEvents(assignmentId?: number): Promise<any[]>;
  createMortalityEvent(event: any): Promise<any>;

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

  // Scenario Planning API
  // Temperature Profiles
  getTemperatureProfiles(search?: string, ordering?: string): Promise<TemperatureProfile[]>;
  getTemperatureProfile(id: number): Promise<TemperatureProfile | undefined>;
  createTemperatureProfile(profile: InsertTemperatureProfile): Promise<TemperatureProfile>;
  getTemperatureProfileStatistics(id: number): Promise<{
    profileId: number;
    name: string;
    statistics: {
      min: number;
      max: number;
      avg: number;
      stdDev: number;
      median: number;
      count: number;
      dateRange: { start: string; end: string };
    };
    monthlyAverages: Array<{ month: string; avgTemp: number }>;
  }>;
  createTemperatureReadings(profileId: number, readings: InsertTemperatureReading[]): Promise<TemperatureReading[]>;

  // TGC Models
  getTgcModels(location?: string, releasePeriod?: string, search?: string, ordering?: string): Promise<TgcModel[]>;
  getTgcModel(id: number): Promise<TgcModel | undefined>;
  createTgcModel(model: InsertTgcModel): Promise<TgcModel>;
  duplicateTgcModel(id: number, newName: string): Promise<TgcModel>;
  getTgcModelTemplates(): Promise<Array<{
    name: string;
    location: string;
    releasePeriod: string;
    tgcValue: number;
    exponentN: number;
    exponentM: number;
    description: string;
  }>>;

  // FCR Models
  getFcrModels(search?: string, ordering?: string): Promise<FcrModel[]>;
  getFcrModel(id: number): Promise<FcrModel | undefined>;
  createFcrModel(model: InsertFcrModel): Promise<FcrModel>;
  getFcrModelStageSummary(id: number): Promise<{
    modelId: number;
    modelName: string;
    totalStages: number;
    totalDuration: number;
    averageFcr: number;
    stages: Array<{
      stageName: string;
      fcrValue: number;
      durationDays: number;
      weightRange: { min: number; max: number };
      overrideCount: number;
    }>;
  }>;

  // Mortality Models
  getMortalityModels(frequency?: string, search?: string, ordering?: string): Promise<MortalityModel[]>;
  getMortalityModel(id: number): Promise<MortalityModel | undefined>;
  createMortalityModel(model: InsertMortalityModel): Promise<MortalityModel>;

  // Biological Constraints
  getBiologicalConstraints(search?: string, ordering?: string): Promise<BiologicalConstraint[]>;
  getBiologicalConstraint(id: number): Promise<BiologicalConstraint | undefined>;
  createBiologicalConstraint(constraint: InsertBiologicalConstraint): Promise<BiologicalConstraint>;

  // Scenarios
  getScenarios(
    all?: boolean,
    startDate?: string,
    tgcModelLocation?: string,
    search?: string,
    ordering?: string
  ): Promise<Scenario[]>;
  getScenario(id: number): Promise<Scenario | undefined>;
  createScenario(scenario: InsertScenario): Promise<Scenario>;
  duplicateScenario(
    id: number,
    newName: string,
    includeProjections?: boolean,
    includeModelChanges?: boolean
  ): Promise<Scenario>;
  createScenarioFromBatch(
    batchId: number,
    scenarioName: string,
    durationDays: number,
    useCurrentModels?: boolean
  ): Promise<Scenario>;
  runScenarioProjection(id: number): Promise<{
    success: boolean;
    summary: {
      totalDays: number;
      finalWeight: number;
      finalPopulation: number;
      finalBiomass: number;
      totalFeedConsumed: number;
      overallFcr: number;
      survivalRate: number;
      stagesReached: string[];
    };
    warnings: string[];
    message: string;
  }>;

  // Scenario Projections
  getScenarioProjections(
    scenarioId: number,
    startDate?: string,
    endDate?: string,
    aggregation?: string
  ): Promise<ScenarioProjection[]>;
  getScenarioChartData(
    scenarioId: number,
    metrics?: string[],
    chartType?: string,
    aggregation?: string
  ): Promise<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      yAxisID?: string;
    }>;
    options: any;
  }>;

  // Scenario Planning Dashboard KPIs
  getScenarioPlanningKPIs(): Promise<{
    totalActiveScenarios: number;
    scenariosInProgress: number;
    completedProjections: number;
    averageProjectionDuration: number;
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
  
  // Complex batch tracking storage
  private batchContainerAssignments: Map<number, any> = new Map();
  private batchTransfers: Map<number, any> = new Map();
  private growthSamples: Map<number, any> = new Map();
  private mortalityEvents: Map<number, any> = new Map();
  
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
  
  // Scenario Planning data stores
  private temperatureProfiles: Map<number, TemperatureProfile> = new Map();
  private temperatureReadings: Map<number, TemperatureReading> = new Map();
  private tgcModels: Map<number, TgcModel> = new Map();
  private tgcStageOverrides: Map<number, TgcStageOverride> = new Map();
  private fcrModels: Map<number, FcrModel> = new Map();
  private fcrModelStages: Map<number, FcrModelStage> = new Map();
  private fcrWeightOverrides: Map<number, FcrWeightOverride> = new Map();
  private mortalityModels: Map<number, MortalityModel> = new Map();
  private mortalityStageOverrides: Map<number, MortalityStageOverride> = new Map();
  private biologicalConstraints: Map<number, BiologicalConstraint> = new Map();
  private biologicalConstraintStages: Map<number, BiologicalConstraintStage> = new Map();
  private scenarios: Map<number, Scenario> = new Map();
  private scenarioModelChanges: Map<number, ScenarioModelChange> = new Map();
  private scenarioProjections: Map<number, ScenarioProjection> = new Map();
  
  private currentId = 1;

  constructor() {
    this.seedData().catch(console.error);
  }

  private async seedData() {
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
    
    const batchTemplates: Array<{ stage: any; ageDays: number; mortality: number; avgWeightG: number; stagePrefix: string }> = [
      // Adult stage batches (sea cages) - showing various progress levels
      { stage: adultStage, ageDays: 600, mortality: 0.25, avgWeightG: 4500, stagePrefix: "AD" }, // 33% through (600/450 = beyond, so shows as complete)
      { stage: adultStage, ageDays: 540, mortality: 0.24, avgWeightG: 4200, stagePrefix: "AD" }, // 20% through adult stage
      { stage: adultStage, ageDays: 630, mortality: 0.23, avgWeightG: 3800, stagePrefix: "AD" }, // 40% through adult stage
      { stage: adultStage, ageDays: 720, mortality: 0.22, avgWeightG: 3400, stagePrefix: "AD" }, // 60% through adult stage
      { stage: adultStage, ageDays: 810, mortality: 0.21, avgWeightG: 3000, stagePrefix: "AD" }, // 80% through adult stage
      
      // Post-smolt stage showing color progression
      { stage: postSmoltStage, ageDays: 420, mortality: 0.20, avgWeightG: 800, stagePrefix: "PS" }, // 20% through post-smolt
      { stage: postSmoltStage, ageDays: 440, mortality: 0.19, avgWeightG: 600, stagePrefix: "PS" }, // 40% through post-smolt  
      { stage: postSmoltStage, ageDays: 470, mortality: 0.18, avgWeightG: 400, stagePrefix: "PS" }, // 70% through post-smolt
      { stage: postSmoltStage, ageDays: 490, mortality: 0.17, avgWeightG: 350, stagePrefix: "PS" }, // 90% through post-smolt
      
      // Smolt stage showing different progress levels
      { stage: smoltStage, ageDays: 320, mortality: 0.17, avgWeightG: 180, stagePrefix: "SM" }, // 20% through smolt
      { stage: smoltStage, ageDays: 350, mortality: 0.16, avgWeightG: 160, stagePrefix: "SM" }, // 50% through smolt
      { stage: smoltStage, ageDays: 380, mortality: 0.15, avgWeightG: 140, stagePrefix: "SM" }, // 80% through smolt
      
      // Parr stage with varied progress
      { stage: parrStage, ageDays: 250, mortality: 0.14, avgWeightG: 25, stagePrefix: "PA" }, // 50% through parr
      { stage: parrStage, ageDays: 280, mortality: 0.13, avgWeightG: 30, stagePrefix: "PA" }, // 80% through parr
      { stage: parrStage, ageDays: 290, mortality: 0.12, avgWeightG: 35, stagePrefix: "PA" }, // 90% through parr
      
      // Fry stage with progress indicators
      { stage: fryStage, ageDays: 130, mortality: 0.11, avgWeightG: 2.5, stagePrefix: "FR" }, // 30% through fry
      { stage: fryStage, ageDays: 150, mortality: 0.10, avgWeightG: 3.0, stagePrefix: "FR" }, // 50% through fry
      { stage: fryStage, ageDays: 180, mortality: 0.09, avgWeightG: 4.0, stagePrefix: "FR" }, // 80% through fry
      
      // Egg stage with some progress
      { stage: eggStage, ageDays: 60, mortality: 0.05, avgWeightG: 0.1, stagePrefix: "EG" }, // 60% through egg
      { stage: eggStage, ageDays: 80, mortality: 0.06, avgWeightG: 0.1, stagePrefix: "EG" }, // 80% through egg
      { stage: eggStage, ageDays: 95, mortality: 0.07, avgWeightG: 0.1, stagePrefix: "EG" }  // 95% through egg
    ];

    // Create one complex traceability batch first
    const complexBatch = await this.createComplexTraceabilityBatch(
      atlanticSalmon, containers, [eggStage, fryStage, parrStage, smoltStage, postSmoltStage, adultStage],
      pair1, user1
    );
    
    // Generate 74 additional batches with realistic progression
    const batches: Batch[] = [complexBatch];
    let batchCounter = 2;
    
    for (let i = 0; i < 74; i++) {
      const template = batchTemplates[i % batchTemplates.length];
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - template.ageDays);
      
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
        status: template.stage.name === "Adult" && template.ageDays >= 540 ? "harvested" : "active",
        expectedHarvestDate: harvestDate.toISOString().split('T')[0],
        notes: `${template.stage.name} stage batch - Day ${template.ageDays}`,
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
      
      // Update container with batch reference for container distribution
      const assignedContainer = containers[i % containers.length];
      const updatedContainer = { ...assignedContainer, batchId: batch.id };
      this.containers.set(assignedContainer.id, updatedContainer);
      
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

  // Complex Batch Tracking Implementation
  async getBatchContainerAssignments(batchId?: number): Promise<any[]> {
    const assignments = Array.from(this.batchContainerAssignments.values());
    return batchId ? assignments.filter(a => a.batch === batchId) : assignments;
  }

  async createBatchContainerAssignment(assignment: any): Promise<any> {
    const newAssignment = {
      id: this.currentId++,
      ...assignment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.batchContainerAssignments.set(newAssignment.id, newAssignment);
    return newAssignment;
  }

  async getBatchTransfers(batchId?: number): Promise<any[]> {
    const transfers = Array.from(this.batchTransfers.values());
    return batchId ? transfers.filter(t => t.batch === batchId) : transfers;
  }

  async createBatchTransfer(transfer: any): Promise<any> {
    const newTransfer = {
      id: this.currentId++,
      ...transfer,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.batchTransfers.set(newTransfer.id, newTransfer);
    return newTransfer;
  }

  async getGrowthSamples(assignmentId?: number): Promise<any[]> {
    const samples = Array.from(this.growthSamples.values());
    return assignmentId ? samples.filter(s => s.containerAssignment === assignmentId) : samples;
  }

  async createGrowthSample(sample: any): Promise<any> {
    const newSample = {
      id: this.currentId++,
      ...sample,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.growthSamples.set(newSample.id, newSample);
    return newSample;
  }

  async getMortalityEvents(assignmentId?: number): Promise<any[]> {
    const events = Array.from(this.mortalityEvents.values());
    return assignmentId ? events.filter(e => e.containerAssignment === assignmentId) : events;
  }

  async createMortalityEvent(event: any): Promise<any> {
    const newEvent = {
      id: this.currentId++,
      ...event,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mortalityEvents.set(newEvent.id, newEvent);
    return newEvent;
  }

  // Create a complex batch with full lifecycle tracking
  private async createComplexTraceabilityBatch(
    species: Species, 
    containers: Container[], 
    stages: Stage[], 
    broodstockPair: BroodstockPair,
    user: User
  ): Promise<Batch> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 18); // 18 months ago
    
    // Create the master batch
    const complexBatch: Batch = {
      id: this.currentId++,
      name: "BATCH-2024-TRACE-001",
      species: species.id,
      startDate: startDate.toISOString().split('T')[0],
      initialCount: 5000000, // 5M eggs
      initialBiomassKg: "5000.000",
      currentCount: 850000, // Final harvest count after full lifecycle
      currentBiomassKg: "4250000.000", // 5kg average at harvest
      container: null, // Complex batch spans multiple containers
      stage: stages[5].id, // Currently at Adult stage
      status: "active",
      expectedHarvestDate: new Date().toISOString().split('T')[0],
      notes: "Complex traceability batch with full lifecycle tracking through multiple container types",
      eggSource: "internal",
      broodstockPairId: broodstockPair.id,
      eggSupplierId: null,
      eggBatchNumber: null,
      eggProductionDate: startDate.toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.batches.set(complexBatch.id, complexBatch);

    // Define container progression for realistic salmon lifecycle
    const lifecycleProgression = [
      // Egg stage - 10 egg/alevin tanks
      { stage: stages[0], containerCount: 10, duration: 90, mortalityRate: 0.15, avgWeight: 0.1 },
      // Fry stage - 12 fry tanks  
      { stage: stages[1], containerCount: 12, duration: 120, mortalityRate: 0.12, avgWeight: 3.5 },
      // Parr stage - 16 parr tanks
      { stage: stages[2], containerCount: 16, duration: 150, mortalityRate: 0.10, avgWeight: 35 },
      // Smolt stage - 12 smolt tanks
      { stage: stages[3], containerCount: 12, duration: 90, mortalityRate: 0.08, avgWeight: 180 },
      // Post-smolt stage - 16 post-smolt tanks
      { stage: stages[4], containerCount: 16, duration: 120, mortalityRate: 0.06, avgWeight: 800 },
      // Adult stage - 22 sea rings
      { stage: stages[5], containerCount: 22, duration: 365, mortalityRate: 0.05, avgWeight: 5000 }
    ];

    let currentDate = new Date(startDate);
    let remainingFish = complexBatch.initialCount;
    let currentBiomass = parseFloat(complexBatch.initialBiomassKg);

    // Create container assignments and transfers for each lifecycle stage
    for (let stageIndex = 0; stageIndex < lifecycleProgression.length; stageIndex++) {
      const stageInfo = lifecycleProgression[stageIndex];
      const stageContainers = containers.slice(0, stageInfo.containerCount);
      
      // Calculate fish distribution across containers
      const fishPerContainer = Math.floor(remainingFish / stageInfo.containerCount);
      const biomassPerContainer = (fishPerContainer * stageInfo.avgWeight) / 1000;

      // Create assignments for this stage
      const assignments: any[] = [];
      for (let i = 0; i < stageContainers.length; i++) {
        const container = stageContainers[i];
        const assignment = await this.createBatchContainerAssignment({
          batch: complexBatch.id,
          container: container.id,
          lifecycleStage: stageInfo.stage.id,
          populationCount: fishPerContainer,
          avgWeightG: stageInfo.avgWeight.toString(),
          biomassKg: biomassPerContainer.toString(),
          assignmentDate: currentDate.toISOString().split('T')[0],
          departureDate: null,
          isActive: stageIndex === lifecycleProgression.length - 1,
          notes: `${stageInfo.stage.name} stage assignment - Container ${i + 1}/${stageInfo.containerCount}`,
        });
        assignments.push(assignment);

        // Create growth samples
        for (let sampleWeek = 0; sampleWeek < Math.floor(stageInfo.duration / 14); sampleWeek++) {
          const sampleDate = new Date(currentDate);
          sampleDate.setDate(sampleDate.getDate() + (sampleWeek * 14));
          
          const weightVariation = 1 + (Math.random() - 0.5) * 0.2; // ±10% variation
          const sampleWeight = stageInfo.avgWeight * weightVariation;
          const kFactor = 100 * (sampleWeight / Math.pow(12, 3)); // Simplified K-factor

          await this.createGrowthSample({
            containerAssignment: assignment.id,
            sampleDate: sampleDate.toISOString().split('T')[0],
            sampleSize: 50,
            avgWeightG: sampleWeight.toString(),
            avgLengthCm: "12.0",
            conditionFactor: kFactor.toString(),
            stdDeviationWeight: (sampleWeight * 0.15).toString(),
            stdDeviationLength: "1.5",
            sampledBy: user.id,
            notes: `Biweekly growth sample - Week ${sampleWeek + 1}`,
          });
        }

        // Create mortality events
        const mortalityCount = Math.floor(fishPerContainer * stageInfo.mortalityRate * 0.1);
        if (mortalityCount > 0) {
          const mortalityDate = new Date(currentDate);
          mortalityDate.setDate(mortalityDate.getDate() + Math.floor(stageInfo.duration / 2));
          
          await this.createMortalityEvent({
            containerAssignment: assignment.id,
            eventDate: mortalityDate.toISOString().split('T')[0],
            mortalityCount,
            cause: stageIndex < 3 ? "Natural mortality" : "Sea lice treatment stress",
            investigation: `Standard mortality investigation completed`,
            preventiveMeasures: `Enhanced monitoring protocols implemented`,
            reportedBy: user.id,
          });
        }

        // Create environmental readings for this container
        const tempParam = Array.from(this.environmentalParameters.values()).find(p => p.name === "Temperature");
        const oxygenParam = Array.from(this.environmentalParameters.values()).find(p => p.name === "Oxygen");
        
        if (tempParam && oxygenParam) {
          for (let day = 0; day < stageInfo.duration; day += 7) {
            const readingDate = new Date(currentDate);
            readingDate.setDate(readingDate.getDate() + day);
            
            // Temperature reading
            const tempReading: EnvironmentalReading = {
              id: this.currentId++,
              container: container.id,
              parameter: tempParam.id,
              value: (stageIndex < 4 ? 8 + Math.random() * 4 : 12 + Math.random() * 6).toFixed(1), // Freshwater vs seawater temps
              readingTime: readingDate,
              sensor: null,
              notes: `Weekly environmental monitoring`,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            this.environmentalReadings.set(tempReading.id, tempReading);

            // Oxygen reading
            const oxygenReading: EnvironmentalReading = {
              id: this.currentId++,
              container: container.id,
              parameter: oxygenParam.id,
              value: (8.5 + Math.random() * 2).toFixed(1),
              readingTime: readingDate,
              sensor: null,
              notes: `Weekly environmental monitoring`,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            this.environmentalReadings.set(oxygenReading.id, oxygenReading);
          }
        }
      }

      // Create complex transfers between stages - for all transitions after the first stage
      if (stageIndex > 0) {
        // Get all previous assignments for this batch (not just active ones for historical tracking)
        const allPrevAssignments = await this.getBatchContainerAssignments(complexBatch.id);
        const prevStageAssignments = allPrevAssignments.filter(a => 
          a.lifecycleStage === lifecycleProgression[stageIndex - 1].stage.id
        );
        
        // Create transfers from previous stage to current stage
        for (let i = 0; i < Math.min(prevStageAssignments.length, assignments.length); i++) {
          const fromAssignment = prevStageAssignments[i];
          const toAssignment = assignments[i % assignments.length];
          
          // Create realistic transfer percentages (40-80% per transfer for stage transitions)
          const transferPercentage = 40 + Math.random() * 40;
          const transferCount = Math.floor(fromAssignment.populationCount * (transferPercentage / 100));
          const transferBiomass = transferCount * stageInfo.avgWeight / 1000;

          await this.createBatchTransfer({
            batch: complexBatch.id,
            fromContainerAssignment: fromAssignment.id,
            toContainerAssignment: toAssignment.id,
            transferType: i % 3 === 0 ? "SPLIT" : (i % 3 === 1 ? "MOVE" : "CONSOLIDATE"),
            populationCount: transferCount,
            biomassKg: transferBiomass.toString(),
            transferDate: currentDate.toISOString().split('T')[0],
            transferPercentage: transferPercentage.toString(),
            reason: `Stage transition from ${lifecycleProgression[stageIndex-1].stage.name} to ${stageInfo.stage.name}`,
            performedBy: user.id,
            notes: `Lifecycle progression transfer - Batch moved to ${stageInfo.containerCount} ${stageInfo.stage.name} containers`,
          });

          // Mark previous assignment as completed
          fromAssignment.isActive = false;
          fromAssignment.departureDate = currentDate.toISOString().split('T')[0];
          this.batchContainerAssignments.set(fromAssignment.id, fromAssignment);
        }

        // Also create additional intra-stage transfers to demonstrate complex movement patterns
        if (assignments.length > 2 && stageIndex > 2) {
          // Create 2-3 additional transfers within the same stage for realistic management
          const numIntraTransfers = Math.min(3, Math.floor(assignments.length / 3));
          for (let j = 0; j < numIntraTransfers; j++) {
            const sourceIdx = j * 2;
            const targetIdx = sourceIdx + 1;
            if (sourceIdx < assignments.length && targetIdx < assignments.length) {
              const intraTransferDate = new Date(currentDate);
              intraTransferDate.setDate(intraTransferDate.getDate() + (j + 1) * 30); // Monthly intra-stage transfers

              const intraPercentage = 20 + Math.random() * 20; // Smaller percentages for optimization transfers
              const intraCount = Math.floor(assignments[sourceIdx].populationCount * (intraPercentage / 100));
              const intraBiomass = intraCount * stageInfo.avgWeight / 1000;

              await this.createBatchTransfer({
                batch: complexBatch.id,
                fromContainerAssignment: assignments[sourceIdx].id,
                toContainerAssignment: assignments[targetIdx].id,
                transferType: "OPTIMIZE",
                populationCount: intraCount,
                biomassKg: intraBiomass.toString(),
                transferDate: intraTransferDate.toISOString().split('T')[0],
                transferPercentage: intraPercentage.toString(),
                reason: `Container optimization - load balancing within ${stageInfo.stage.name} stage`,
                performedBy: user.id,
                notes: `Optimization transfer for better container utilization`,
              });
            }
          }
        }
      }

      // Update date and population for next stage
      currentDate.setDate(currentDate.getDate() + stageInfo.duration);
      remainingFish = Math.floor(remainingFish * (1 - stageInfo.mortalityRate));
      currentBiomass = (remainingFish * stageInfo.avgWeight) / 1000;
    }

    return complexBatch;
  }
}

export const storage = new MemStorage();