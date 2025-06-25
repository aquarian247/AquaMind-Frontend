import { 
  users, farmSites, pens, alerts, environmentalParameters, containers, sensors, 
  environmentalReadings, batches, feedTypes, feedInventory, feedingEvents, healthRecords,
  feedPurchases, feedContainers, feedContainerStock, batchFeedingSummaries,
  species, stages, labSamples, healthAssessments, weatherData, broodstockPairs, eggSuppliers,
  temperatureProfiles, temperatureReadings, tgcModels, tgcStageOverrides,
  fcrModels, fcrModelStages, fcrWeightOverrides, mortalityModels, mortalityStageOverrides,
  biologicalConstraints, biologicalConstraintStages, scenarios, scenarioModelChanges, scenarioProjections,
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
  type MortalityEvent, type InsertMortalityEvent,
  type TemperatureProfile, type InsertTemperatureProfile,
  type TemperatureReading, type InsertTemperatureReading,
  type TgcModel, type InsertTgcModel,
  type TgcStageOverride, type InsertTgcStageOverride,
  type FcrModel, type InsertFcrModel,
  type FcrModelStage, type InsertFcrModelStage,
  type FcrWeightOverride, type InsertFcrWeightOverride,
  type MortalityModel, type InsertMortalityModel,
  type MortalityStageOverride, type InsertMortalityStageOverride,
  type BiologicalConstraint, type InsertBiologicalConstraint,
  type BiologicalConstraintStage, type InsertBiologicalConstraintStage,
  type Scenario, type InsertScenario,
  type ScenarioModelChange, type InsertScenarioModelChange,
  type ScenarioProjection, type InsertScenarioProjection
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
  private fcrStages: Map<number, FcrStage> = new Map();
  private fcrModelStages: Map<number, FcrModelStage> = new Map();
  private fcrWeightOverrides: Map<number, FcrWeightOverride> = new Map();
  private mortalityModels: Map<number, MortalityModel> = new Map();
  private mortalityStageOverrides: Map<number, MortalityStageOverride> = new Map();
  private biologicalConstraints: Map<number, BiologicalConstraint> = new Map();
  private biologicalConstraintStages: Map<number, BiologicalConstraintStage> = new Map();
  private scenarios: Map<number, Scenario> = new Map();
  private scenarioModelChanges: Map<number, ScenarioModelChange> = new Map();
  private scenarioProjections: Map<number, ScenarioProjection> = new Map();
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

    // Seed Scenario Planning Data
    await this.seedScenarioPlanningData();
  }

  private async seedScenarioPlanningData() {
    // Temperature Profiles
    const profile1: TemperatureProfile = {
      id: this.currentId++,
      name: "North Atlantic Winter Profile",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.temperatureProfiles.set(profile1.id, profile1);

    const profile2: TemperatureProfile = {
      id: this.currentId++,
      name: "North Atlantic Summer Profile",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.temperatureProfiles.set(profile2.id, profile2);

    const profile3: TemperatureProfile = {
      id: this.currentId++,
      name: "Norwegian Fjord Profile",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.temperatureProfiles.set(profile3.id, profile3);

    // Temperature readings for profiles
    const winterTemps = [4.2, 3.8, 3.5, 3.2, 3.8, 4.5, 5.2, 6.1, 7.3, 8.1, 6.8, 5.4];
    const summerTemps = [8.5, 9.2, 10.8, 12.5, 14.2, 15.8, 16.5, 16.1, 14.7, 12.3, 10.1, 9.0];
    const fjordTemps = [6.2, 6.8, 7.5, 8.9, 10.2, 11.8, 13.1, 12.9, 11.4, 9.7, 8.1, 6.9];

    [profile1.id, profile2.id, profile3.id].forEach((profileId, profileIndex) => {
      const temps = [winterTemps, summerTemps, fjordTemps][profileIndex];
      temps.forEach((temp, monthIndex) => {
        const reading: TemperatureReading = {
          id: this.currentId++,
          profileId,
          readingDate: `2024-${String(monthIndex + 1).padStart(2, '0')}-15`,
          temperature: temp.toString(),
          createdAt: new Date(),
        };
        this.temperatureReadings.set(reading.id, reading);
      });
    });

    // TGC Models
    const tgcModel1: TgcModel = {
      id: this.currentId++,
      name: "Atlantic Salmon Standard TGC",
      location: "North Atlantic",
      releasePeriod: "Spring",
      tgcValue: "0.003",
      exponentN: "1.0",
      exponentM: "0.333",
      profileId: profile1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tgcModels.set(tgcModel1.id, tgcModel1);

    const tgcModel2: TgcModel = {
      id: this.currentId++,
      name: "High Performance TGC Model",
      location: "Norwegian Fjords",
      releasePeriod: "Summer",
      tgcValue: "0.0035",
      exponentN: "1.0",
      exponentM: "0.333",
      profileId: profile3.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tgcModels.set(tgcModel2.id, tgcModel2);

    // FCR Models
    const fcrModel1: FcrModel = {
      id: this.currentId++,
      name: "Standard FCR Profile",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.fcrModels.set(fcrModel1.id, fcrModel1);

    const fcrModel2: FcrModel = {
      id: this.currentId++,
      name: "Premium Feed FCR Profile",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.fcrModels.set(fcrModel2.id, fcrModel2);

    // Add more TGC Models for variety
    const tgcModel3: TgcModel = {
      id: this.currentId++,
      name: "Scottish Highlands TGC",
      location: "Scottish Highlands",
      releasePeriod: "Spring",
      tgcValue: "0.0028",
      exponentN: "1.0",
      exponentM: "0.333",
      profileId: profile2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tgcModels.set(tgcModel3.id, tgcModel3);

    const tgcModel4: TgcModel = {
      id: this.currentId++,
      name: "Faroe Islands Standard",
      location: "Faroe Islands",
      releasePeriod: "Autumn",
      tgcValue: "0.0032",
      exponentN: "1.0",
      exponentM: "0.333",
      profileId: profile1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tgcModels.set(tgcModel4.id, tgcModel4);

    // Add more FCR Models
    const fcrModel3: FcrModel = {
      id: this.currentId++,
      name: "Eco-Efficient FCR Profile",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.fcrModels.set(fcrModel3.id, fcrModel3);

    // FCR Stages for each model
    const fcrStagesStandard = [
      { stage: "fry", fcrValue: "1.0", durationDays: 90 },
      { stage: "parr", fcrValue: "1.1", durationDays: 90 },
      { stage: "smolt", fcrValue: "1.0", durationDays: 90 },
      { stage: "post_smolt", fcrValue: "1.1", durationDays: 120 },
      { stage: "adult", fcrValue: "1.2", durationDays: 400 }
    ];

    const fcrStagesPremium = [
      { stage: "fry", fcrValue: "0.95", durationDays: 90 },
      { stage: "parr", fcrValue: "1.05", durationDays: 90 },
      { stage: "smolt", fcrValue: "0.98", durationDays: 90 },
      { stage: "post_smolt", fcrValue: "1.08", durationDays: 120 },
      { stage: "adult", fcrValue: "1.15", durationDays: 400 }
    ];

    const fcrStagesEco = [
      { stage: "fry", fcrValue: "1.02", durationDays: 90 },
      { stage: "parr", fcrValue: "1.12", durationDays: 90 },
      { stage: "smolt", fcrValue: "1.03", durationDays: 90 },
      { stage: "post_smolt", fcrValue: "1.13", durationDays: 120 },
      { stage: "adult", fcrValue: "1.22", durationDays: 400 }
    ];

    [
      { modelId: fcrModel1.id, stages: fcrStagesStandard },
      { modelId: fcrModel2.id, stages: fcrStagesPremium },
      { modelId: fcrModel3.id, stages: fcrStagesEco }
    ].forEach(({ modelId, stages }) => {
      stages.forEach(stage => {
        const fcrStage: FcrStage = {
          id: this.currentId++,
          fcrModelId: modelId,
          stage: stage.stage,
          fcrValue: stage.fcrValue,
          durationDays: stage.durationDays,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.fcrStages.set(fcrStage.id, fcrStage);
      });
    });

    // Mortality Models
    const mortalityModel1: MortalityModel = {
      id: this.currentId++,
      name: "Standard Mortality Profile",
      frequency: "daily",
      rate: "0.00015",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mortalityModels.set(mortalityModel1.id, mortalityModel1);

    const mortalityModel2: MortalityModel = {
      id: this.currentId++,
      name: "Low Mortality Profile",
      frequency: "daily",
      rate: "0.00008",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mortalityModels.set(mortalityModel2.id, mortalityModel2);

    const mortalityModel3: MortalityModel = {
      id: this.currentId++,
      name: "High Risk Environment",
      frequency: "daily",
      rate: "0.00025",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mortalityModels.set(mortalityModel3.id, mortalityModel3);

    // Biological Constraints
    const biologicalConstraint1: BiologicalConstraint = {
      id: this.currentId++,
      name: "Standard Growth Constraints",
      description: "Standard biological limits for Atlantic salmon growth stages",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.biologicalConstraints.set(biologicalConstraint1.id, biologicalConstraint1);

    // Get first user for scenario creation
    const firstUser = Array.from(this.users.values())[0];

    // Scenarios
    const scenario1: Scenario = {
      id: this.currentId++,
      name: "12-Month Growth Projection",
      description: "Standard 12-month growth scenario for spring release Atlantic salmon",
      startDate: "2024-04-01",
      durationDays: 365,
      initialCount: 100000,
      initialWeight: "15.000",
      genotype: "AquaGen Atlantic",
      supplier: "AquaGen AS",
      tgcModelId: tgcModel1.id,
      fcrModelId: fcrModel1.id,
      mortalityModelId: mortalityModel1.id,
      batchId: null,
      biologicalConstraintsId: biologicalConstraint1.id,
      status: "completed",
      createdBy: firstUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.scenarios.set(scenario1.id, scenario1);

    const scenario2: Scenario = {
      id: this.currentId++,
      name: "Premium Feed Scenario",
      description: "Comparison scenario using premium feed with enhanced FCR",
      startDate: "2024-04-01",
      durationDays: 365,
      initialCount: 100000,
      initialWeight: "15.000",
      genotype: "AquaGen Atlantic",
      supplier: "AquaGen AS",
      tgcModelId: tgcModel2.id,
      fcrModelId: fcrModel2.id,
      mortalityModelId: mortalityModel2.id,
      batchId: null,
      biologicalConstraintsId: biologicalConstraint1.id,
      status: "draft",
      createdBy: firstUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.scenarios.set(scenario2.id, scenario2);

    // Add more scenarios for demonstration
    const scenario3: Scenario = {
      id: this.currentId++,
      name: "Scottish Site Comparison",
      description: "Scenario modeling growth at Scottish Highlands location with cooler temperatures",
      startDate: "2024-03-15",
      durationDays: 420,
      initialCount: 95000,
      initialWeight: "12.500",
      genotype: "SalmoBreed Plus",
      supplier: "Scottish Salmon Company",
      tgcModelId: tgcModel3.id,
      fcrModelId: fcrModel1.id,
      mortalityModelId: mortalityModel1.id,
      batchId: null,
      biologicalConstraintsId: biologicalConstraint1.id,
      status: "active",
      createdBy: firstUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.scenarios.set(scenario3.id, scenario3);

    const scenario4: Scenario = {
      id: this.currentId++,
      name: "Eco-Efficient Production",
      description: "Sustainable production model with eco-efficient feed and reduced environmental impact",
      startDate: "2024-05-01",
      durationDays: 390,
      initialCount: 120000,
      initialWeight: "18.000",
      genotype: "AquaGen Atlantic",
      supplier: "AquaGen AS",
      tgcModelId: tgcModel4.id,
      fcrModelId: fcrModel3.id,
      mortalityModelId: mortalityModel2.id,
      batchId: null,
      biologicalConstraintsId: biologicalConstraint1.id,
      status: "completed",
      createdBy: firstUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.scenarios.set(scenario4.id, scenario4);

    // Get a batch for "from batch" scenario
    const firstBatch = Array.from(this.batches.values())[0];
    if (firstBatch) {
      const scenario5: Scenario = {
        id: this.currentId++,
        name: `Batch ${firstBatch.batchNumber} Growth Projection`,
        description: "Real batch scenario based on current production data",
        startDate: "2024-06-01",
        durationDays: 300,
        initialCount: firstBatch.initialCount || 85000,
        initialWeight: firstBatch.averageWeight?.toString() || "25.000",
        genotype: "Current Production Stock",
        supplier: "Internal Production",
        tgcModelId: tgcModel1.id,
        fcrModelId: fcrModel2.id,
        mortalityModelId: mortalityModel1.id,
        batchId: firstBatch.id,
        biologicalConstraintsId: biologicalConstraint1.id,
        status: "draft",
        createdBy: firstUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.scenarios.set(scenario5.id, scenario5);
    }

    // Generate realistic projections for all scenarios
    this.generateScenarioProjections([scenario1, scenario2, scenario3, scenario4, scenario5]);
  }

  // Generate realistic scenario projections based on linked models
  private generateScenarioProjections(scenarios: Scenario[]) {
    scenarios.forEach(scenario => {
      const tgcModel = this.tgcModels.get(scenario.tgcModelId);
      const fcrModel = this.fcrModels.get(scenario.fcrModelId);
      const mortalityModel = this.mortalityModels.get(scenario.mortalityModelId);
      
      if (!tgcModel || !fcrModel || !mortalityModel) return;
      
      const tgcValue = parseFloat(tgcModel.tgcValue);
      const startDate = new Date(scenario.startDate);
      let currentWeight = parseFloat(scenario.initialWeight);
      let currentCount = scenario.initialCount;
      let totalFeedConsumed = 0;
      
      // Get temperature profile - using first available profile for demo
      const tempProfile = Array.from(this.temperatureProfiles.values())[0];
      const tempReadings = Array.from(this.temperatureReadings.values())
        .filter(r => r.profileId === tempProfile?.id)
        .sort((a, b) => new Date(a.readingDate).getTime() - new Date(b.readingDate).getTime());
      
      // Generate weekly projections over scenario duration
      for (let week = 0; week < Math.ceil(scenario.durationDays / 7); week++) {
        const projectionDate = new Date(startDate);
        projectionDate.setDate(startDate.getDate() + (week * 7));
        
        // Get temperature for this week (cycle through available data)
        const tempIndex = week % (tempReadings.length || 12);
        const temperature = tempReadings[tempIndex] ? 
          parseFloat(tempReadings[tempIndex].temperature) : 
          8 + Math.sin((week / 52) * 2 * Math.PI) * 4; // Seasonal fallback
        
        // TGC-based growth calculation
        // TGC = (W2^(1/3) - W1^(1/3)) / (T * days)
        // Rearranged: W2 = (W1^(1/3) + TGC * T * days)^3
        const days = 7;
        const w1CubeRoot = Math.pow(currentWeight, 1/3);
        const growthIncrement = tgcValue * temperature * days;
        const newWeight = Math.pow(w1CubeRoot + growthIncrement, 3);
        
        // FCR-based feed calculation
        const weightGain = newWeight - currentWeight;
        const biomassGain = (weightGain * currentCount) / 1000; // kg
        
        // Get FCR for current weight stage
        const fcr = this.getFcrForWeight(currentWeight);
        const feedRequired = biomassGain * fcr;
        totalFeedConsumed += feedRequired;
        
        // Mortality calculation (simplified based on stage)
        const weeklyMortalityRate = this.getMortalityForWeight(currentWeight) / 52; // Convert annual to weekly
        currentCount = Math.floor(currentCount * (1 - weeklyMortalityRate));
        
        // Calculate cumulative FCR
        const totalBiomassGain = ((currentCount * newWeight) - (scenario.initialCount * parseFloat(scenario.initialWeight))) / 1000;
        const cumulativeFcr = totalBiomassGain > 0 ? totalFeedConsumed / totalBiomassGain : 0;

        const projection: ScenarioProjection = {
          id: this.currentId++,
          scenarioId: scenario.id,
          projectionDate: projectionDate.toISOString().split('T')[0],
          weekNumber: week,
          fishCount: currentCount,
          averageWeight: parseFloat(newWeight.toFixed(3)),
          totalBiomass: parseFloat(((currentCount * newWeight) / 1000).toFixed(2)), // tonnes
          feedConsumed: parseFloat(feedRequired.toFixed(2)),
          cumulativeFeed: parseFloat(totalFeedConsumed.toFixed(2)),
          fcr: parseFloat(cumulativeFcr.toFixed(3)),
          mortalityRate: parseFloat((weeklyMortalityRate * 100).toFixed(3)),
          waterTemperature: parseFloat(temperature.toFixed(1)),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        this.scenarioProjections.set(projection.id, projection);
        currentWeight = newWeight;
      }
    });
  }
  
  // Helper method to get FCR for specific weight range based on linked models
  private getFcrForWeight(weight: number): number {
    if (weight < 50) return 1.0; // Fry stage
    if (weight < 200) return 1.1; // Parr stage
    if (weight < 500) return 1.15; // Smolt stage
    if (weight < 1000) return 1.2; // Post-smolt
    return 1.25; // Adult stage
  }
  
  // Helper method to get mortality rate for specific weight range
  private getMortalityForWeight(weight: number): number {
    if (weight < 50) return 0.15; // 15% annual mortality for fry
    if (weight < 200) return 0.08; // 8% for parr
    if (weight < 500) return 0.05; // 5% for smolt
    return 0.03; // 3% for adult fish
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

  // Scenario Planning Implementation
  
  // Temperature Profiles
  async getTemperatureProfiles(search?: string, ordering?: string): Promise<TemperatureProfile[]> {
    let profiles = Array.from(this.temperatureProfiles.values());
    
    if (search) {
      profiles = profiles.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (ordering === '-created_at') {
      profiles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (ordering === 'name') {
      profiles.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return profiles;
  }

  async getTemperatureProfile(id: number): Promise<TemperatureProfile | undefined> {
    return this.temperatureProfiles.get(id);
  }

  async createTemperatureProfile(profile: InsertTemperatureProfile): Promise<TemperatureProfile> {
    const newProfile: TemperatureProfile = {
      ...profile,
      id: this.currentId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.temperatureProfiles.set(newProfile.id, newProfile);
    return newProfile;
  }

  async getTemperatureProfileStatistics(id: number): Promise<{
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
  }> {
    const profile = this.temperatureProfiles.get(id);
    if (!profile) throw new Error('Profile not found');
    
    const readings = Array.from(this.temperatureReadings.values())
      .filter(r => r.profileId === id);
    
    const temps = readings.map(r => parseFloat(r.temperature));
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
    const sortedTemps = temps.sort((a, b) => a - b);
    const median = sortedTemps[Math.floor(sortedTemps.length / 2)];
    const stdDev = Math.sqrt(temps.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / temps.length);
    
    const monthlyAverages = readings.reduce((acc, reading) => {
      const month = reading.readingDate.substring(0, 7);
      if (!acc[month]) acc[month] = [];
      acc[month].push(parseFloat(reading.temperature));
      return acc;
    }, {} as Record<string, number[]>);
    
    return {
      profileId: id,
      name: profile.name,
      statistics: {
        min,
        max,
        avg,
        stdDev,
        median,
        count: temps.length,
        dateRange: {
          start: readings[0]?.readingDate || '',
          end: readings[readings.length - 1]?.readingDate || ''
        }
      },
      monthlyAverages: Object.entries(monthlyAverages).map(([month, temps]) => ({
        month,
        avgTemp: temps.reduce((a, b) => a + b, 0) / temps.length
      }))
    };
  }

  async createTemperatureReadings(profileId: number, readings: InsertTemperatureReading[]): Promise<TemperatureReading[]> {
    return readings.map(reading => {
      const newReading: TemperatureReading = {
        ...reading,
        id: this.currentId++,
        profileId,
        createdAt: new Date(),
      };
      this.temperatureReadings.set(newReading.id, newReading);
      return newReading;
    });
  }

  // TGC Models
  async getTgcModels(location?: string, releasePeriod?: string, search?: string, ordering?: string): Promise<TgcModel[]> {
    let models = Array.from(this.tgcModels.values());
    
    if (location) {
      models = models.filter(m => m.location?.toLowerCase().includes(location.toLowerCase()));
    }
    
    if (releasePeriod) {
      models = models.filter(m => m.releasePeriod?.toLowerCase().includes(releasePeriod.toLowerCase()));
    }
    
    if (search) {
      models = models.filter(m => 
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return models;
  }

  async getTgcModel(id: number): Promise<TgcModel | undefined> {
    return this.tgcModels.get(id);
  }

  async createTgcModel(model: InsertTgcModel): Promise<TgcModel> {
    const newModel: TgcModel = {
      ...model,
      id: this.currentId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tgcModels.set(newModel.id, newModel);
    return newModel;
  }

  async duplicateTgcModel(id: number, newName: string): Promise<TgcModel> {
    const original = this.tgcModels.get(id);
    if (!original) throw new Error('TGC Model not found');
    
    const duplicate: TgcModel = {
      ...original,
      id: this.currentId++,
      name: newName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tgcModels.set(duplicate.id, duplicate);
    return duplicate;
  }

  async getTgcModelTemplates(): Promise<Array<{
    name: string;
    location: string;
    releasePeriod: string;
    tgcValue: number;
    exponentN: number;
    exponentM: number;
    description: string;
  }>> {
    return [
      {
        name: "North Atlantic Standard",
        location: "North Atlantic",
        releasePeriod: "Spring",
        tgcValue: 0.003,
        exponentN: 1.0,
        exponentM: 0.333,
        description: "Standard TGC model for North Atlantic salmon farming"
      },
      {
        name: "Norwegian Fjord Enhanced",
        location: "Norwegian Fjords",
        releasePeriod: "Summer",
        tgcValue: 0.0035,
        exponentN: 1.0,
        exponentM: 0.333,
        description: "Enhanced TGC model optimized for Norwegian fjord conditions"
      }
    ];
  }

  // FCR Models
  async getFcrModels(search?: string, ordering?: string): Promise<FcrModel[]> {
    let models = Array.from(this.fcrModels.values());
    
    if (search) {
      models = models.filter(m => 
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return models;
  }

  async getFcrModel(id: number): Promise<FcrModel | undefined> {
    return this.fcrModels.get(id);
  }

  async createFcrModel(model: InsertFcrModel): Promise<FcrModel> {
    const newModel: FcrModel = {
      ...model,
      id: this.currentId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.fcrModels.set(newModel.id, newModel);
    return newModel;
  }

  async getFcrModelStageSummary(id: number): Promise<{
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
  }> {
    const model = this.fcrModels.get(id);
    if (!model) throw new Error('FCR Model not found');
    
    return {
      modelId: id,
      modelName: model.name,
      totalStages: 6,
      totalDuration: 540,
      averageFcr: 1.15,
      stages: [
        { stageName: "Fry", fcrValue: 0.9, durationDays: 90, weightRange: { min: 0.1, max: 5 }, overrideCount: 0 },
        { stageName: "Parr", fcrValue: 1.0, durationDays: 120, weightRange: { min: 5, max: 50 }, overrideCount: 2 },
        { stageName: "Smolt", fcrValue: 1.1, durationDays: 90, weightRange: { min: 50, max: 200 }, overrideCount: 1 },
        { stageName: "Post-smolt", fcrValue: 1.2, durationDays: 120, weightRange: { min: 200, max: 1000 }, overrideCount: 0 },
        { stageName: "Grow-out", fcrValue: 1.3, durationDays: 180, weightRange: { min: 1000, max: 4000 }, overrideCount: 3 },
        { stageName: "Harvest", fcrValue: 1.4, durationDays: 90, weightRange: { min: 4000, max: 6000 }, overrideCount: 1 }
      ]
    };
  }

  // Mortality Models
  async getMortalityModels(frequency?: string, search?: string, ordering?: string): Promise<MortalityModel[]> {
    let models = Array.from(this.mortalityModels.values());
    
    if (frequency) {
      models = models.filter(m => m.frequency === frequency);
    }
    
    if (search) {
      models = models.filter(m => 
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return models;
  }

  async getMortalityModel(id: number): Promise<MortalityModel | undefined> {
    return this.mortalityModels.get(id);
  }

  async createMortalityModel(model: InsertMortalityModel): Promise<MortalityModel> {
    const newModel: MortalityModel = {
      ...model,
      id: this.currentId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mortalityModels.set(newModel.id, newModel);
    return newModel;
  }

  // Biological Constraints
  async getBiologicalConstraints(search?: string, ordering?: string): Promise<BiologicalConstraint[]> {
    let constraints = Array.from(this.biologicalConstraints.values());
    
    if (search) {
      constraints = constraints.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return constraints;
  }

  async getBiologicalConstraint(id: number): Promise<BiologicalConstraint | undefined> {
    return this.biologicalConstraints.get(id);
  }

  async createBiologicalConstraint(constraint: InsertBiologicalConstraint): Promise<BiologicalConstraint> {
    const newConstraint: BiologicalConstraint = {
      ...constraint,
      id: this.currentId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.biologicalConstraints.set(newConstraint.id, newConstraint);
    return newConstraint;
  }

  // Scenarios
  async getScenarios(
    all?: boolean,
    startDate?: string,
    tgcModelLocation?: string,
    search?: string,
    ordering?: string
  ): Promise<Scenario[]> {
    let scenarios = Array.from(this.scenarios.values());
    
    if (startDate) {
      scenarios = scenarios.filter(s => s.startDate >= startDate);
    }
    
    if (tgcModelLocation) {
      const tgcModelsInLocation = Array.from(this.tgcModels.values())
        .filter(m => m.location?.toLowerCase().includes(tgcModelLocation.toLowerCase()))
        .map(m => m.id);
      scenarios = scenarios.filter(s => tgcModelsInLocation.includes(s.tgcModelId));
    }
    
    if (search) {
      scenarios = scenarios.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (ordering === '-created_at') {
      scenarios.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    
    return scenarios;
  }

  async getScenario(id: number): Promise<Scenario | undefined> {
    return this.scenarios.get(id);
  }

  async createScenario(scenario: InsertScenario): Promise<Scenario> {
    const newScenario: Scenario = {
      ...scenario,
      id: this.currentId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.scenarios.set(newScenario.id, newScenario);
    return newScenario;
  }

  async duplicateScenario(
    id: number,
    newName: string,
    includeProjections?: boolean,
    includeModelChanges?: boolean
  ): Promise<Scenario> {
    const original = this.scenarios.get(id);
    if (!original) throw new Error('Scenario not found');
    
    const duplicate: Scenario = {
      ...original,
      id: this.currentId++,
      name: newName,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.scenarios.set(duplicate.id, duplicate);
    return duplicate;
  }

  async createScenarioFromBatch(
    batchId: number,
    scenarioName: string,
    durationDays: number,
    useCurrentModels?: boolean
  ): Promise<Scenario> {
    const batch = this.batches.get(batchId);
    if (!batch) throw new Error('Batch not found');
    
    const firstTgcModel = Array.from(this.tgcModels.values())[0];
    const firstFcrModel = Array.from(this.fcrModels.values())[0];
    const firstMortalityModel = Array.from(this.mortalityModels.values())[0];
    const firstUser = Array.from(this.users.values())[0];
    
    const newScenario: Scenario = {
      id: this.currentId++,
      name: scenarioName,
      description: `Scenario created from batch ${batch.name}`,
      startDate: batch.startDate,
      durationDays,
      initialCount: batch.initialCount,
      initialWeight: "15.000",
      genotype: "AquaGen Atlantic",
      supplier: "From Batch",
      tgcModelId: firstTgcModel.id,
      fcrModelId: firstFcrModel.id,
      mortalityModelId: firstMortalityModel.id,
      batchId,
      biologicalConstraintsId: null,
      status: "draft",
      createdBy: firstUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.scenarios.set(newScenario.id, newScenario);
    return newScenario;
  }

  async runScenarioProjection(id: number): Promise<{
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
  }> {
    const scenario = this.scenarios.get(id);
    if (!scenario) throw new Error('Scenario not found');
    
    // Update scenario status
    scenario.status = "completed";
    this.scenarios.set(id, scenario);
    
    return {
      success: true,
      summary: {
        totalDays: scenario.durationDays,
        finalWeight: 4850.5,
        finalPopulation: 85000,
        finalBiomass: 412292.5,
        totalFeedConsumed: 475534.8,
        overallFcr: 1.15,
        survivalRate: 85.0,
        stagesReached: ["Fry", "Parr", "Smolt", "Post-smolt", "Grow-out", "Harvest"]
      },
      warnings: [
        "Temperature exceeded optimal range for 3 days during summer period",
        "FCR temporarily increased during week 28 due to high temperatures"
      ],
      message: "Scenario projection completed successfully"
    };
  }

  // Scenario Projections
  async getScenarioProjections(
    scenarioId: number,
    startDate?: string,
    endDate?: string,
    aggregation?: string
  ): Promise<ScenarioProjection[]> {
    let projections = Array.from(this.scenarioProjections.values())
      .filter(p => p.scenarioId === scenarioId);
    
    if (startDate) {
      projections = projections.filter(p => p.projectionDate >= startDate);
    }
    
    if (endDate) {
      projections = projections.filter(p => p.projectionDate <= endDate);
    }
    
    return projections.sort((a, b) => a.dayNumber - b.dayNumber);
  }

  async getScenarioChartData(
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
  }> {
    const projections = await this.getScenarioProjections(scenarioId);
    
    return {
      labels: projections.map(p => p.projectionDate),
      datasets: [
        {
          label: "Average Weight (g)",
          data: projections.map(p => parseFloat(p.averageWeight)),
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          yAxisID: "y"
        },
        {
          label: "Population",
          data: projections.map(p => parseFloat(p.population)),
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          yAxisID: "y1"
        },
        {
          label: "Biomass (kg)",
          data: projections.map(p => parseFloat(p.biomass)),
          borderColor: "#F59E0B",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          yAxisID: "y2"
        }
      ],
      options: {
        responsive: true,
        scales: {
          y: { type: 'linear', display: true, position: 'left' },
          y1: { type: 'linear', display: true, position: 'right' },
          y2: { type: 'linear', display: false }
        }
      }
    };
  }

  // Scenario Planning Dashboard KPIs
  async getScenarioPlanningKPIs(): Promise<{
    totalActiveScenarios: number;
    scenariosInProgress: number;
    completedProjections: number;
    averageProjectionDuration: number;
  }> {
    const scenarios = Array.from(this.scenarios.values());
    const activeScenarios = scenarios.filter(s => s.status !== "failed");
    const inProgress = scenarios.filter(s => s.status === "running");
    const completed = scenarios.filter(s => s.status === "completed");
    
    return {
      totalActiveScenarios: activeScenarios.length,
      scenariosInProgress: inProgress.length,
      completedProjections: completed.length,
      averageProjectionDuration: scenarios.reduce((sum, s) => sum + s.durationDays, 0) / scenarios.length || 0
    };
  }

  // Scenario Planning API Implementation - Missing Methods
  async getScenarios(): Promise<Scenario[]> {
    return Array.from(this.scenarios.values());
  }

  async createScenario(scenario: InsertScenario): Promise<Scenario> {
    const newScenario: Scenario = {
      id: this.currentId++,
      ...scenario,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.scenarios.set(newScenario.id, newScenario);
    return newScenario;
  }

  async deleteScenario(id: number): Promise<void> {
    this.scenarios.delete(id);
  }

  async getTemperatureProfiles(): Promise<TemperatureProfile[]> {
    return Array.from(this.temperatureProfiles.values());
  }

  async getTemperatureProfile(id: number): Promise<TemperatureProfile | null> {
    return this.temperatureProfiles.get(id) || null;
  }

  async getTemperatureReadings(profileId: number): Promise<TemperatureReading[]> {
    return Array.from(this.temperatureReadings.values()).filter(
      reading => reading.profileId === profileId
    );
  }

  async createTemperatureProfile(profile: InsertTemperatureProfile): Promise<TemperatureProfile> {
    const newProfile: TemperatureProfile = {
      id: this.currentId++,
      ...profile,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.temperatureProfiles.set(newProfile.id, newProfile);
    return newProfile;
  }

  async getTgcModels(): Promise<TgcModel[]> {
    return Array.from(this.tgcModels.values());
  }

  async createTgcModel(model: InsertTgcModel): Promise<TgcModel> {
    const newModel: TgcModel = {
      id: this.currentId++,
      ...model,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tgcModels.set(newModel.id, newModel);
    return newModel;
  }

  async getFcrModels(): Promise<FcrModel[]> {
    return Array.from(this.fcrModels.values());
  }

  async createFcrModel(model: InsertFcrModel): Promise<FcrModel> {
    const newModel: FcrModel = {
      id: this.currentId++,
      ...model,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.fcrModels.set(newModel.id, newModel);
    return newModel;
  }

  async getMortalityModels(): Promise<MortalityModel[]> {
    return Array.from(this.mortalityModels.values());
  }

  async createMortalityModel(model: InsertMortalityModel): Promise<MortalityModel> {
    const newModel: MortalityModel = {
      id: this.currentId++,
      ...model,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mortalityModels.set(newModel.id, newModel);
    return newModel;
  }

  async getBiologicalConstraints(): Promise<BiologicalConstraint[]> {
    return Array.from(this.biologicalConstraints.values());
  }

  async createBiologicalConstraint(constraint: InsertBiologicalConstraint): Promise<BiologicalConstraint> {
    const newConstraint: BiologicalConstraint = {
      id: this.currentId++,
      ...constraint,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.biologicalConstraints.set(newConstraint.id, newConstraint);
    return newConstraint;
  }
}

export const storage = new MemStorage();