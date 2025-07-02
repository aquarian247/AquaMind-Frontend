/**
 * Django API Integration Layer  – Migration Wrapper
 *
 * NOTE:
 * This file is currently acting as a shim while we migrate from the
 * hand-crafted `apiRequest` helpers + custom TypeScript interfaces to the
 * auto-generated OpenAPI client (`openapi-typescript-codegen`).
 *
 * 1.  All domain models & list response types are re-exported from
 *     `client/src/api` which itself re-exports the generated client (`/generated`).
 * 2.  Existing method signatures are preserved so the rest of the codebase
 *     compiles without changes.  Internal implementations can be gradually
 *     swapped to use `ApiService` instead of `apiRequest`.
 * 3.  Once every call path is migrated we can delete this wrapper and
 *     reference the generated client directly.
 */

import { apiRequest } from "./queryClient";
import { DJANGO_ENDPOINTS } from "./config";

// Re-exported/generated types
import type {
  DjangoListResponse,
  Geography,
  Area,
  Container,
  Sensor,
  Species,
  LifeCycleStage as LifecycleStage,
  Batch,
  BatchContainerAssignment,
  BatchTransfer,
  GrowthSample,
  MortalityEvent,
  Feed,
  FeedPurchase,
  FeedStock,
  FeedingEvent,
  EnvironmentalReading,
  EnvironmentalParameter,
  WeatherData,
  PhotoperiodData,
  BroodstockFish,
  BreedingPlan,
  BreedingPair,
  EggProduction,
  EggSupplier,
  Scenario,
  TGCModel,
  FCRModel,
  MortalityModel,
  User,
  UserProfile,
} from "../api";

// Generated client (not yet wired into every method – will replace apiRequest gradually)
import { ApiService } from "../api";

export interface DjangoErrorResponse {
  detail?: string;
  [key: string]: any;
}

// Django API Client
export class DjangoApiClient {
  // Helper method to handle Django list responses
  private async getList<T>(endpoint: string, params?: Record<string, any>): Promise<DjangoListResponse<T>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await apiRequest("GET", `${endpoint}${queryString}`);
    return response.json();
  }

  private async get<T>(endpoint: string): Promise<T> {
    const response = await apiRequest("GET", endpoint);
    return response.json();
  }

  private async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await apiRequest("POST", endpoint, data);
    return response.json();
  }

  private async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await apiRequest("PATCH", endpoint, data);
    return response.json();
  }

  private async delete(endpoint: string): Promise<void> {
    await apiRequest("DELETE", endpoint);
  }

  // Infrastructure API methods
  async getGeographies(): Promise<DjangoListResponse<Geography>> {
    return this.getList<Geography>(DJANGO_ENDPOINTS.GEOGRAPHIES);
  }

  async getAreas(geographyId?: number): Promise<DjangoListResponse<Area>> {
    const params = geographyId ? { geography: geographyId } : {};
    return this.getList<Area>(DJANGO_ENDPOINTS.AREAS, params);
  }

  async getStations(geographyId?: number) {
    const params = geographyId ? { geography: geographyId } : {};
    return this.getList(DJANGO_ENDPOINTS.STATIONS, params);
  }

  async getHalls(stationId?: number) {
    const params = stationId ? { freshwater_station: stationId } : {};
    return this.getList(DJANGO_ENDPOINTS.HALLS, params);
  }

  async getContainers(filters?: { hall?: number; area?: number; container_type?: string; active?: boolean }): Promise<DjangoListResponse<Container>> {
    return this.getList<Container>(DJANGO_ENDPOINTS.CONTAINERS, filters);
  }

  async getSensors(containerId?: number): Promise<DjangoListResponse<Sensor>> {
    const params = containerId ? { container: containerId } : {};
    return this.getList<Sensor>(DJANGO_ENDPOINTS.SENSORS, params);
  }

  // Batch Management API methods
  async getBatches(filters?: { species?: number; lifecycle_stage?: number; status?: string }): Promise<DjangoListResponse<Batch>> {
    return this.getList<Batch>(DJANGO_ENDPOINTS.BATCHES, filters);
  }

  async getBatch(id: number): Promise<Batch> {
    return this.get<Batch>(`${DJANGO_ENDPOINTS.BATCHES}${id}/`);
  }

  async createBatch(data: any): Promise<Batch> {
    return this.post<Batch>(DJANGO_ENDPOINTS.BATCHES, data);
  }

  async updateBatch(id: number, data: any): Promise<Batch> {
    return this.patch<Batch>(`${DJANGO_ENDPOINTS.BATCHES}${id}/`, data);
  }

  async getSpecies(): Promise<DjangoListResponse<Species>> {
    return this.getList<Species>(DJANGO_ENDPOINTS.SPECIES);
  }

  async getLifecycleStages(): Promise<DjangoListResponse<LifecycleStage>> {
    return this.getList<LifecycleStage>(DJANGO_ENDPOINTS.LIFECYCLE_STAGES);
  }

  async getBatchAssignments(batchId?: number): Promise<DjangoListResponse<BatchContainerAssignment>> {
    const params = batchId ? { batch: batchId } : {};
    return this.getList<BatchContainerAssignment>(DJANGO_ENDPOINTS.BATCH_ASSIGNMENTS, params);
  }

  async getBatchTransfers(batchId?: number): Promise<DjangoListResponse<BatchTransfer>> {
    const params = batchId ? { source_batch: batchId } : {};
    return this.getList<BatchTransfer>(DJANGO_ENDPOINTS.BATCH_TRANSFERS, params);
  }

  async getGrowthSamples(assignmentId?: number): Promise<DjangoListResponse<GrowthSample>> {
    const params = assignmentId ? { assignment: assignmentId } : {};
    return this.getList<GrowthSample>(DJANGO_ENDPOINTS.GROWTH_SAMPLES, params);
  }

  async getMortalityEvents(batchId?: number): Promise<DjangoListResponse<MortalityEvent>> {
    const params = batchId ? { batch: batchId } : {};
    return this.getList<MortalityEvent>(DJANGO_ENDPOINTS.MORTALITY_EVENTS, params);
  }

  // Inventory API methods
  async getFeedTypes() {
    return this.getList(DJANGO_ENDPOINTS.FEED_TYPES);
  }

  async getFeedPurchases() {
    return this.getList(DJANGO_ENDPOINTS.FEED_PURCHASES);
  }

  async getFeedStock(filters?: { feed_container?: number; feed?: number }) {
    return this.getList(DJANGO_ENDPOINTS.FEED_STOCK, filters);
  }

  async getFeedingEvents(filters?: { batch?: number; date_range?: string }) {
    return this.getList(DJANGO_ENDPOINTS.FEEDING_EVENTS, filters);
  }

  async createFeedingEvent(data: any) {
    return this.post(DJANGO_ENDPOINTS.FEEDING_EVENTS, data);
  }

  // Health API methods
  async getHealthRecords(batchId?: number) {
    const params = batchId ? { batch: batchId } : {};
    return this.getList(DJANGO_ENDPOINTS.HEALTH_RECORDS, params);
  }

  async getHealthAssessments(batchId?: number) {
    const params = batchId ? { batch: batchId } : {};
    return this.getList(DJANGO_ENDPOINTS.HEALTH_ASSESSMENTS, params);
  }

  async getLabSamples(filters?: { batch?: number; sample_type?: string }) {
    return this.getList(DJANGO_ENDPOINTS.LAB_SAMPLES, filters);
  }

  async createHealthRecord(data: any) {
    return this.post(DJANGO_ENDPOINTS.HEALTH_RECORDS, data);
  }

  // Environmental API methods
  async getEnvironmentalReadings(filters?: { 
    sensor?: number; 
    parameter?: string; 
    start_date?: string; 
    end_date?: string;
    limit?: number;
  }) {
    return this.getList(DJANGO_ENDPOINTS.ENVIRONMENTAL_READINGS, filters);
  }

  async getWeatherData(filters?: { 
    geography?: number; 
    start_date?: string; 
    end_date?: string;
  }) {
    return this.getList(DJANGO_ENDPOINTS.WEATHER_DATA, filters);
  }

  // Authentication API methods
  async login(username: string, password: string) {
    return this.post(DJANGO_ENDPOINTS.AUTH_LOGIN, { username, password });
  }

  async logout() {
    return this.post(DJANGO_ENDPOINTS.AUTH_LOGOUT, {});
  }

  async getCurrentUser() {
    return this.get(DJANGO_ENDPOINTS.AUTH_USER);
  }

  // Dashboard aggregation methods (these would need custom Django views)
  async getDashboardKPIs(): Promise<{
    totalFish: number;
    healthRate: number;
    avgWaterTemp: number;
    nextFeedingHours: number;
  }> {
    try {
      // Try Django dashboard endpoint first
      return this.get<{
        totalFish: number;
        healthRate: number;
        avgWaterTemp: number;
        nextFeedingHours: number;
      }>('/api/v1/dashboard/kpis/');
    } catch (error) {
      // Fallback to calculating from individual endpoints
      const [batches, healthRecords] = await Promise.all([
        this.getBatches(),
        this.getHealthRecords()
      ]);

      // Calculate KPIs from available data
      const totalFish = batches.results.reduce((sum, batch: Batch) => sum + (batch.population_count || 0), 0);
      const healthyBatches = batches.results.filter((batch: Batch) => batch.status === 'ACTIVE').length;
      const healthRate = batches.results.length > 0 ? (healthyBatches / batches.results.length) * 100 : 0;

      return {
        totalFish,
        healthRate,
        avgWaterTemp: 12.5, // Would be calculated from environmental readings
        nextFeedingHours: 4
      };
    }
  }

  async getFarmSites(): Promise<Array<{
    id: number;
    name: string;
    location: string;
    status: string;
    fishCount: number;
    healthStatus: string;
  }>> {
    try {
      return this.get<Array<{
        id: number;
        name: string;
        location: string;
        status: string;
        fishCount: number;
        healthStatus: string;
      }>>('/api/v1/dashboard/farm-sites/');
    } catch (error) {
      // Fallback to areas as farm sites
      const areas = await this.getAreas();
      return areas.results.map((area: Area) => ({
        id: area.id,
        name: area.name,
        location: `${area.latitude}, ${area.longitude}`,
        status: area.active ? 'active' : 'inactive',
        fishCount: 0, // Would be calculated
        healthStatus: 'good'
      }));
    }
  }

  async getActiveAlerts() {
    try {
      return this.get('/api/v1/dashboard/alerts/');
    } catch (error) {
      // Return empty alerts if endpoint doesn't exist
      return [];
    }
  }
}

export const djangoApi = new DjangoApiClient();