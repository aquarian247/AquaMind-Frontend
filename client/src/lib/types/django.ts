// Django API Response Types
export interface DjangoListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Infrastructure Types
export interface Geography {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Area {
  id: number;
  name: string;
  geography: number;
  latitude: number;
  longitude: number;
  max_biomass: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Container {
  id: number;
  name: string;
  container_type: number;
  hall?: number;
  area?: number;
  volume_m3: number;
  max_biomass_kg: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Sensor {
  id: number;
  name: string;
  sensor_type: string;
  container: number;
  serial_number: string;
  manufacturer: string;
  installation_date?: string;
  last_calibration_date?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Batch Management Types
export interface Species {
  id: number;
  name: string;
  scientific_name: string;
  created_at: string;
  updated_at: string;
}

export interface LifecycleStage {
  id: number;
  name: string;
  description?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: number;
  batch_number: string;
  species: number;
  lifecycle_stage: number;
  status: string;
  batch_type: string;
  start_date: string;
  expected_end_date?: string;
  actual_end_date?: string;
  notes: string;
  created_at: string;
  updated_at: string;
  population_count?: number;
  biomass_kg?: number;
}

export interface BatchContainerAssignment {
  id: number;
  batch: number;
  container: number;
  lifecycle_stage: number;
  population_count: number;
  avg_weight_g?: number;
  biomass_kg: number;
  assignment_date: string;
  departure_date?: string;
  is_active: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface BatchTransfer {
  id: number;
  transfer_type: string;
  transfer_date: string;
  source_batch: number;
  source_lifecycle_stage: number;
  source_assignment?: number;
  source_count: number;
  source_biomass_kg: number;
  transferred_count: number;
  transferred_biomass_kg: number;
  mortality_count: number;
  destination_batch?: number;
  destination_lifecycle_stage?: number;
  destination_assignment?: number;
  is_emergency_mixing: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface GrowthSample {
  id: number;
  assignment: number;
  sample_date: string;
  sample_size: number;
  avg_weight_g: number;
  avg_length_cm?: number;
  std_deviation_weight?: number;
  std_deviation_length?: number;
  min_weight_g?: number;
  max_weight_g?: number;
  condition_factor?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MortalityEvent {
  id: number;
  batch: number;
  event_date: string;
  count: number;
  cause: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Inventory Types
export interface Feed {
  id: number;
  name: string;
  brand: string;
  size_category: string;
  pellet_size_mm?: number;
  protein_percentage?: number;
  fat_percentage?: number;
  carbohydrate_percentage?: number;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeedPurchase {
  id: number;
  feed: number;
  purchase_date: string;
  quantity_kg: number;
  cost_per_kg: number;
  supplier: string;
  batch_number: string;
  expiry_date?: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface FeedStock {
  id: number;
  feed: number;
  feed_container: number;
  current_quantity_kg: number;
  reorder_threshold_kg: number;
  updated_at: string;
}

export interface FeedingEvent {
  id: number;
  batch: number;
  feed: number;
  quantity_kg: number;
  feeding_date: string;
  feeding_time: string;
  feeding_method: string;
  batch_biomass_kg: number;
  feeding_percentage: number;
  feed_cost: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Health Types
export interface HealthRecord {
  id: number;
  batch: number;
  observation_date: string;
  health_status: string;
  notes: string;
  observer: string;
  created_at: string;
  updated_at: string;
}

export interface HealthAssessment {
  id: number;
  batch: number;
  assessment_date: string;
  assessment_type: string;
  veterinarian: string;
  findings: string;
  recommendations: string;
  follow_up_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface LabSample {
  id: number;
  batch: number;
  sample_date: string;
  sample_type: string;
  lab_name: string;
  test_parameters: string;
  results: string;
  interpretation: string;
  created_at: string;
  updated_at: string;
}

// Environmental Types
export interface EnvironmentalReading {
  id: number;
  sensor: number;
  parameter: string;
  value: number;
  unit: string;
  reading_time: string;
  quality_flag?: string;
  created_at: string;
}

export interface WeatherData {
  id: number;
  geography: number;
  timestamp: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  pressure: number;
  precipitation: number;
  weather_condition: string;
  created_at: string;
}