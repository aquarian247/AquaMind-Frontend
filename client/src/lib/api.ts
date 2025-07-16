import { API_CONFIG } from "./config";
import { ApiService } from "../api/generated";

export interface DashboardKPIs {
  totalFish: number;
  healthRate: number;
  avgWaterTemp: number;
  nextFeedingHours: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }>;
}

// Unified API client that uses the generated OpenAPI client
export const api = {
  // Dashboard endpoints
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    try {
      // Try Django dashboard endpoint first
      const response = await ApiService.apiV1DashboardKpisList();
      return response;
    } catch (error) {
      // Fallback to calculating from individual endpoints
      const [batches, healthRecords] = await Promise.all([
        ApiService.apiV1BatchBatchesList(),
        ApiService.apiV1HealthRecordsList()
      ]);

      // Calculate KPIs from available data
      const totalFish = batches.results.reduce(
        (sum: any, batch: any) => sum + (batch.calculated_population_count ?? 0),
        0,
      );
      const healthyBatches = batches.results.filter((batch: any) => batch.status === 'ACTIVE').length;
      const healthRate = batches.results.length > 0 ? (healthyBatches / batches.results.length) * 100 : 0;

      return {
        totalFish,
        healthRate,
        avgWaterTemp: 12.5, // Would be calculated from environmental readings
        nextFeedingHours: 4
      };
    }
  },

  async getFarmSites() {
    try {
      return await ApiService.apiV1DashboardFarmSitesList();
    } catch (error) {
      // Fallback to areas as farm sites
      const areas = await ApiService.apiV1InfrastructureAreasList();
      return areas.results.map((area: any) => ({
        id: area.id,
        name: area.name,
        location: `${area.latitude}, ${area.longitude}`,
        status: area.active ? 'active' : 'inactive',
        fishCount: 0, // Would be calculated
        healthStatus: 'good'
      }));
    }
  },

  async getActiveAlerts() {
    try {
      return await ApiService.apiV1DashboardAlertsList();
    } catch (error) {
      // Return empty alerts if endpoint doesn't exist
      return [];
    }
  },

  // Chart data endpoints
  async getWaterQualityChart(farmSiteId = 1): Promise<ChartData> {
    // Convert Django environmental readings to chart format
    const readings = await ApiService.apiV1EnvironmentalReadingsList({
      parameter: 'temperature',
      limit: 50
    });
    
    return {
      labels: readings.results.map((r: any) => new Date(r.reading_time).toLocaleDateString()),
      datasets: [{
        label: 'Water Temperature',
        data: readings.results.map((r: any) => r.value),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)'
      }]
    };
  },

  async getFishGrowthChart(): Promise<ChartData> {
    // Convert Django growth samples to chart format
    const samples = await ApiService.apiV1BatchGrowthSamplesList();
    
    return {
      labels: samples.results.map((s: any) => new Date(s.sample_date).toLocaleDateString()),
      datasets: [{
        label: 'Average Weight (g)',
        data: samples.results.map((s: any) => s.avg_weight_g),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)'
      }]
    };
  },

  // Farm management endpoints
  async getPensByFarmSite(farmSiteId: number) {
    // Get containers for the area/site
    const containers = await ApiService.apiV1InfrastructureContainersList({ area: farmSiteId });
    return containers.results.map((container: any) => ({
      id: container.id,
      name: container.name,
      capacity: container.volume_m3,
      currentStock: 0, // Would be calculated from batch assignments
      status: container.active ? 'active' : 'inactive'
    }));
  },

  // Water quality endpoints
  async getWaterQualityReadings(farmSiteId: number, limit = 50) {
    return ApiService.apiV1EnvironmentalReadingsList({
      limit,
      parameter: 'temperature'
    });
  },

  // Alerts endpoints
  async getAllAlerts(activeOnly = false) {
    return ApiService.apiV1DashboardAlertsList();
  },

  async resolveAlert(alertId: number) {
    // This would need a custom Django endpoint
    return ApiService.apiV1AlertsResolve(alertId);
  },

  // Batch management endpoints
  batch: {
    async getAll(filters?: any) {
      return ApiService.apiV1BatchBatchesList(filters);
    },

    async getById(id: number) {
      return ApiService.apiV1BatchBatchesRetrieve(id);
    },

    async create(data: any) {
      return ApiService.apiV1BatchBatchesCreate(data);
    },

    async update(id: number, data: any) {
      return ApiService.apiV1BatchBatchesUpdate(id, data);
    },

    async getAssignments(batchId?: number) {
      return ApiService.apiV1BatchContainerAssignmentsList({ batch: batchId });
    },

    async getTransfers(batchId?: number) {
      return ApiService.apiV1BatchTransfersList({ source_batch: batchId });
    }
  },

  // Infrastructure endpoints
  infrastructure: {
    async getGeographies() {
      return ApiService.apiV1InfrastructureGeographiesList();
    },

    async getAreas(geographyId?: number) {
      return ApiService.apiV1InfrastructureAreasList({ geography: geographyId });
    },

    async getContainers(filters?: any) {
      return ApiService.apiV1InfrastructureContainersList(filters);
    },

    async getSensors(containerId?: number) {
      return ApiService.apiV1InfrastructureSensorsList({ container: containerId });
    }
  },

  // Inventory endpoints
  inventory: {
    async getFeedTypes() {
      return ApiService.apiV1InventoryFeedList();
    },

    async getFeedStock(filters?: any) {
      return ApiService.apiV1InventoryStockList(filters);
    },

    async getFeedingEvents(filters?: any) {
      return ApiService.apiV1InventoryFeedingEventsList(filters);
    },

    async createFeedingEvent(data: any) {
      return ApiService.apiV1InventoryFeedingEventsCreate(data);
    }
  },

  // Health endpoints
  health: {
    async getHealthRecords(batchId?: number) {
      return ApiService.apiV1HealthRecordsList({ batch: batchId });
    },

    async getHealthAssessments(batchId?: number) {
      return ApiService.apiV1HealthAssessmentsList({ batch: batchId });
    },

    async createHealthRecord(data: any) {
      return ApiService.apiV1HealthRecordsCreate(data);
    }
  }
};
