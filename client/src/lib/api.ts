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
      // Dashboard KPIs endpoint doesn't exist, calculate from individual endpoints
      const batches = await ApiService.apiV1BatchBatchesList();
      
      // Calculate KPIs from available data
      const totalFish = batches.results.reduce(
        (sum: any, batch: any) => sum + (batch.calculated_population_count ?? 0),
        0,
      );
      const healthyBatches = batches.results.filter((batch: any) => batch.status === 'ACTIVE').length;
      const healthRate = batches.results.length > 0 ? (healthyBatches / batches.results.length) * 100 : 0;

      // Get environmental readings for water temperature
      const envReadings = await ApiService.apiV1EnvironmentalReadingsList();
      const tempReadings = envReadings.results.filter((r: any) => r.parameter_type === 'TEMPERATURE');
      const avgWaterTemp = tempReadings.length > 0 
        ? tempReadings.reduce((sum: number, r: any) => sum + r.value, 0) / tempReadings.length
        : 12.5;

      return {
        totalFish,
        healthRate,
        avgWaterTemp,
        nextFeedingHours: 4
      };
    } catch (error) {
      // Fallback values if API calls fail
      return {
        totalFish: 0,
        healthRate: 0,
        avgWaterTemp: 12.5,
        nextFeedingHours: 4
      };
    }
  },

  async getFarmSites() {
    try {
      // Farm sites endpoint doesn't exist, use areas instead
      const areas = await ApiService.apiV1InfrastructureAreasList();
      return areas.results.map((area: any) => ({
        id: area.id,
        name: area.name,
        location: `${area.latitude || 0}, ${area.longitude || 0}`,
        status: area.active ? 'active' : 'inactive',
        fishCount: 0, // Would be calculated
        healthStatus: 'good'
      }));
    } catch (error) {
      return [];
    }
  },

  async getActiveAlerts() {
    try {
      // No specific alerts endpoint, could be implemented with journal entries or custom endpoint
      // Return empty array for now
      return [];
    } catch (error) {
      return [];
    }
  },

  // Chart data endpoints
  async getWaterQualityChart(farmSiteId = 1): Promise<ChartData> {
    // Get environmental readings
    const readings = await ApiService.apiV1EnvironmentalReadingsList();
    
    // Filter for temperature readings if needed
    const tempReadings = readings.results.filter((r: any) => r.parameter_type === 'TEMPERATURE');
    
    return {
      labels: tempReadings.map((r: any) => new Date(r.reading_time).toLocaleDateString()),
      datasets: [{
        label: 'Water Temperature',
        data: tempReadings.map((r: any) => r.value),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)'
      }]
    };
  },

  async getFishGrowthChart(): Promise<ChartData> {
    // Get growth samples
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
    const containers = await ApiService.apiV1InfrastructureContainersList();
    
    // Filter for the specific area if needed
    const areaContainers = containers.results.filter((c: any) => c.area === farmSiteId);
    
    return areaContainers.map((container: any) => ({
      id: container.id,
      name: container.name,
      capacity: container.volume_m3,
      currentStock: 0, // Would be calculated from batch assignments
      status: container.active ? 'active' : 'inactive'
    }));
  },

  // Water quality endpoints
  async getWaterQualityReadings(farmSiteId: number, limit = 50) {
    // Get all readings and filter as needed
    const readings = await ApiService.apiV1EnvironmentalReadingsList();
    return {
      ...readings,
      results: readings.results.slice(0, limit)
    };
  },

  // Alerts endpoints
  async getAllAlerts(activeOnly = false) {
    // No specific alerts endpoint, could be implemented with journal entries
    return [];
  },

  async resolveAlert(alertId: number) {
    // No specific alert resolve endpoint
    // This would need to be implemented on the backend
    console.warn('Alert resolution not implemented in API');
    return { success: false };
  },

  // Batch management endpoints
  batch: {
    async getAll(filters?: any) {
      return ApiService.apiV1BatchBatchesList();
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
      const assignments = await ApiService.apiV1BatchContainerAssignmentsList();
      if (batchId) {
        return {
          ...assignments,
          results: assignments.results.filter((a: any) => a.batch === batchId)
        };
      }
      return assignments;
    },

    async getTransfers(batchId?: number) {
      const transfers = await ApiService.apiV1BatchTransfersList();
      if (batchId) {
        return {
          ...transfers,
          results: transfers.results.filter((t: any) => t.source_batch === batchId)
        };
      }
      return transfers;
    }
  },

  // Infrastructure endpoints
  infrastructure: {
    async getGeographies() {
      return ApiService.apiV1InfrastructureGeographiesList();
    },

    async getAreas(geographyId?: number) {
      if (geographyId) {
        return ApiService.apiV1InfrastructureAreasList({
          geography: geographyId
        } as any);
      }
      return ApiService.apiV1InfrastructureAreasList();
    },

    async getContainers(filters?: any) {
      return ApiService.apiV1InfrastructureContainersList(filters);
    },

    async getSensors(containerId?: number) {
      if (containerId) {
        return ApiService.apiV1InfrastructureSensorsList({
          container: containerId
        } as any);
      }
      return ApiService.apiV1InfrastructureSensorsList();
    }
  },

  // Inventory endpoints
  inventory: {
    async getFeedTypes() {
      return ApiService.apiV1InventoryFeedsList();
    },

    async getFeedStock(filters?: any) {
      return ApiService.apiV1InventoryFeedStocksList();
    },

    async getFeedingEvents(filters?: any) {
      return ApiService.apiV1InventoryFeedingEventsList();
    },

    async createFeedingEvent(data: any) {
      return ApiService.apiV1InventoryFeedingEventsCreate(data);
    }
  },

  // Health endpoints
  health: {
    async getHealthRecords(batchId?: number) {
      if (batchId) {
        // Filter client-side if needed since the endpoint may not support filtering
        const records = await ApiService.apiV1HealthHealthSamplingEventsList();
        return {
          ...records,
          results: records.results.filter((r: any) => r.batch === batchId)
        };
      }
      return ApiService.apiV1HealthHealthSamplingEventsList();
    },

    async getHealthAssessments(batchId?: number) {
      // This endpoint might not exist in the current API
      // Fallback to health sampling events if needed
      try {
        const records = await ApiService.apiV1HealthHealthSamplingEventsList();
        if (batchId) {
          return {
            ...records,
            results: records.results.filter((r: any) => r.batch === batchId)
          };
        }
        return records;
      } catch (error) {
        return { results: [] };
      }
    },

    async createHealthRecord(data: any) {
      return ApiService.apiV1HealthHealthSamplingEventsCreate(data);
    }
  }
};
