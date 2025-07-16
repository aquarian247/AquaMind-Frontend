import { API_CONFIG } from "./config";
import { ApiService } from "../api/generated";

/**
 * NOTE:
 * The generated client (`ApiService`) exposes **all** operations on a single
 * class.  Previous code referenced sub-services that no longer exist after we
 * switched generators.  To minimise refactor churn we create a loose-typed
 * alias so existing call-sites remain readable while we verify the exact
 * method names emitted by the generator.
 *
 * Replace `apiSvc.<method>` with strongly-typed equivalents as we stabilise
 * the contract.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiSvc = ApiService as any;

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
      const response = await ApiService.getDashboardKpis();
      return response;
    } catch (error) {
      // Fallback to calculating from individual endpoints
      const [batches, healthRecords] = await Promise.all([
        BatchService.getBatches(),
        HealthService.getHealthRecords()
      ]);

      // Calculate KPIs from available data
      const totalFish = batches.results.reduce(
        (sum, batch) => sum + (batch.calculated_population_count ?? 0),
        0,
      );
      const healthyBatches = batches.results.filter((batch) => batch.status === 'ACTIVE').length;
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
      return await ApiService.getFarmSites();
    } catch (error) {
      // Fallback to areas as farm sites
      const areas = await InfrastructureService.getAreas();
      return areas.results.map((area) => ({
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
      return await ApiService.getActiveAlerts();
    } catch (error) {
      // Return empty alerts if endpoint doesn't exist
      return [];
    }
  },

  // Chart data endpoints
  async getWaterQualityChart(farmSiteId = 1): Promise<ChartData> {
    // Convert Django environmental readings to chart format
    const readings = await EnvironmentalService.getEnvironmentalReadings({
      parameter: 'temperature',
      limit: 50
    });
    
    return {
      labels: readings.results.map((r) => new Date(r.reading_time).toLocaleDateString()),
      datasets: [{
        label: 'Water Temperature',
        data: readings.results.map((r) => r.value),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)'
      }]
    };
  },

  async getFishGrowthChart(): Promise<ChartData> {
    // Convert Django growth samples to chart format
    const samples = await BatchService.getGrowthSamples();
    
    return {
      labels: samples.results.map((s) => new Date(s.sample_date).toLocaleDateString()),
      datasets: [{
        label: 'Average Weight (g)',
        data: samples.results.map((s) => s.avg_weight_g),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)'
      }]
    };
  },

  // Farm management endpoints
  async getPensByFarmSite(farmSiteId: number) {
    // Get containers for the area/site
    const containers = await InfrastructureService.getContainers({ area: farmSiteId });
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
    return EnvironmentalService.getEnvironmentalReadings({
      limit,
      parameter: 'temperature'
    });
  },

  // Alerts endpoints
  async getAllAlerts(activeOnly = false) {
    return ApiService.getActiveAlerts();
  },

  async resolveAlert(alertId: number) {
    // This would need a custom Django endpoint
    return ApiService.resolveAlert(alertId);
  },

  // Batch management endpoints
  batch: {
    async getAll(filters?: any) {
      return BatchService.getBatches(filters);
    },

    async getById(id: number) {
      return BatchService.getBatch(id);
    },

    async create(data: any) {
      return BatchService.createBatch(data);
    },

    async update(id: number, data: any) {
      return BatchService.updateBatch(id, data);
    },

    async getAssignments(batchId?: number) {
      return BatchService.getBatchContainerAssignments({ batch: batchId });
    },

    async getTransfers(batchId?: number) {
      return BatchService.getBatchTransfers({ source_batch: batchId });
    }
  },

  // Infrastructure endpoints
  infrastructure: {
    async getGeographies() {
      return InfrastructureService.getGeographies();
    },

    async getAreas(geographyId?: number) {
      return InfrastructureService.getAreas({ geography: geographyId });
    },

    async getContainers(filters?: any) {
      return InfrastructureService.getContainers(filters);
    },

    async getSensors(containerId?: number) {
      return InfrastructureService.getSensors({ container: containerId });
    }
  },

  // Inventory endpoints
  inventory: {
    async getFeedTypes() {
      return InventoryService.getFeedTypes();
    },

    async getFeedStock(filters?: any) {
      return InventoryService.getFeedStock(filters);
    },

    async getFeedingEvents(filters?: any) {
      return InventoryService.getFeedingEvents(filters);
    },

    async createFeedingEvent(data: any) {
      return InventoryService.createFeedingEvent(data);
    }
  },

  // Health endpoints
  health: {
    async getHealthRecords(batchId?: number) {
      return HealthService.getHealthRecords({ batch: batchId });
    },

    async getHealthAssessments(batchId?: number) {
      return HealthService.getHealthAssessments({ batch: batchId });
    },

    async createHealthRecord(data: any) {
      return HealthService.createHealthRecord(data);
    }
  }
};
