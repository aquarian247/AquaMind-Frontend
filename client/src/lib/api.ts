import { apiRequest } from "./queryClient";
import { djangoApi } from "./django-api";
import { API_CONFIG } from "./config";

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

// Unified API client that switches between Django and Express backends
export const api = {
  // Dashboard endpoints
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    if (API_CONFIG.USE_DJANGO_API) {
      return djangoApi.getDashboardKPIs();
    }
    const response = await apiRequest("GET", "/api/dashboard/kpis");
    return response.json();
  },

  async getFarmSites() {
    if (API_CONFIG.USE_DJANGO_API) {
      return djangoApi.getFarmSites();
    }
    const response = await apiRequest("GET", "/api/dashboard/farm-sites");
    return response.json();
  },

  async getActiveAlerts() {
    if (API_CONFIG.USE_DJANGO_API) {
      return djangoApi.getActiveAlerts();
    }
    const response = await apiRequest("GET", "/api/dashboard/alerts");
    return response.json();
  },

  // Chart data endpoints
  async getWaterQualityChart(farmSiteId = 1): Promise<ChartData> {
    if (API_CONFIG.USE_DJANGO_API) {
      // Convert Django environmental readings to chart format
      const readings = await djangoApi.getEnvironmentalReadings({
        parameter: 'temperature',
        limit: 50
      });
      
      return {
        labels: readings.results.map(r => new Date(r.reading_time).toLocaleDateString()),
        datasets: [{
          label: 'Water Temperature',
          data: readings.results.map(r => r.value),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)'
        }]
      };
    }
    const response = await apiRequest("GET", `/api/charts/water-quality?farmSiteId=${farmSiteId}`);
    return response.json();
  },

  async getFishGrowthChart(): Promise<ChartData> {
    if (API_CONFIG.USE_DJANGO_API) {
      // Convert Django growth samples to chart format
      const samples = await djangoApi.getGrowthSamples();
      
      return {
        labels: samples.results.map(s => new Date(s.sample_date).toLocaleDateString()),
        datasets: [{
          label: 'Average Weight (g)',
          data: samples.results.map(s => s.avg_weight_g),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)'
        }]
      };
    }
    const response = await apiRequest("GET", "/api/charts/fish-growth");
    return response.json();
  },

  // Farm management endpoints
  async getPensByFarmSite(farmSiteId: number) {
    if (API_CONFIG.USE_DJANGO_API) {
      // Get containers for the area/site
      const containers = await djangoApi.getContainers({ area: farmSiteId });
      return containers.results.map(container => ({
        id: container.id,
        name: container.name,
        capacity: container.volume_m3,
        currentStock: 0, // Would be calculated from batch assignments
        status: container.active ? 'active' : 'inactive'
      }));
    }
    const response = await apiRequest("GET", `/api/farm-sites/${farmSiteId}/pens`);
    return response.json();
  },

  // Water quality endpoints
  async getWaterQualityReadings(farmSiteId: number, limit = 50) {
    if (API_CONFIG.USE_DJANGO_API) {
      return djangoApi.getEnvironmentalReadings({
        limit,
        parameter: 'temperature'
      });
    }
    const response = await apiRequest("GET", `/api/farm-sites/${farmSiteId}/water-quality?limit=${limit}`);
    return response.json();
  },

  // Alerts endpoints
  async getAllAlerts(activeOnly = false) {
    if (API_CONFIG.USE_DJANGO_API) {
      return djangoApi.getActiveAlerts();
    }
    const response = await apiRequest("GET", `/api/alerts?active=${activeOnly}`);
    return response.json();
  },

  async resolveAlert(alertId: number) {
    if (API_CONFIG.USE_DJANGO_API) {
      // This would need a custom Django endpoint
      const response = await apiRequest("PATCH", `/api/v1/alerts/${alertId}/resolve/`);
      return response.json();
    }
    const response = await apiRequest("PATCH", `/api/alerts/${alertId}/resolve`);
    return response.json();
  },

  // Batch management endpoints (Django API)
  batch: {
    async getAll(filters?: any) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.getBatches(filters);
      }
      const response = await apiRequest("GET", "/api/batches");
      return response.json();
    },

    async getById(id: number) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.getBatch(id);
      }
      const response = await apiRequest("GET", `/api/batches/${id}`);
      return response.json();
    },

    async create(data: any) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.createBatch(data);
      }
      const response = await apiRequest("POST", "/api/batches", data);
      return response.json();
    },

    async update(id: number, data: any) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.updateBatch(id, data);
      }
      const response = await apiRequest("PATCH", `/api/batches/${id}`, data);
      return response.json();
    },

    async getAssignments(batchId?: number) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.getBatchAssignments(batchId);
      }
      const endpoint = batchId ? `/api/batches/${batchId}/assignments` : "/api/batch-assignments";
      const response = await apiRequest("GET", endpoint);
      return response.json();
    },

    async getTransfers(batchId?: number) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.getBatchTransfers(batchId);
      }
      const endpoint = batchId ? `/api/batches/${batchId}/transfers` : "/api/batch-transfers";
      const response = await apiRequest("GET", endpoint);
      return response.json();
    }
  },

  // Infrastructure endpoints (Django API)
  infrastructure: {
    async getGeographies() {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.getGeographies();
      }
      const response = await apiRequest("GET", "/api/geographies");
      return response.json();
    },

    async getAreas(geographyId?: number) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.getAreas(geographyId);
      }
      const endpoint = geographyId ? `/api/geographies/${geographyId}/areas` : "/api/areas";
      const response = await apiRequest("GET", endpoint);
      return response.json();
    },

    async getContainers(filters?: any) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.getContainers(filters);
      }
      const response = await apiRequest("GET", "/api/containers");
      return response.json();
    },

    async getSensors(containerId?: number) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.getSensors(containerId);
      }
      const endpoint = containerId ? `/api/containers/${containerId}/sensors` : "/api/sensors";
      const response = await apiRequest("GET", endpoint);
      return response.json();
    }
  },

  // Inventory endpoints (Django API)
  inventory: {
    async getFeedTypes() {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.getFeedTypes();
      }
      const response = await apiRequest("GET", "/api/feed-types");
      return response.json();
    },

    async getFeedStock(filters?: any) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.getFeedStock(filters);
      }
      const response = await apiRequest("GET", "/api/feed-stock");
      return response.json();
    },

    async getFeedingEvents(filters?: any) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.getFeedingEvents(filters);
      }
      const response = await apiRequest("GET", "/api/feeding-events");
      return response.json();
    },

    async createFeedingEvent(data: any) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.createFeedingEvent(data);
      }
      const response = await apiRequest("POST", "/api/feeding-events", data);
      return response.json();
    }
  },

  // Health endpoints (Django API)
  health: {
    async getHealthRecords(batchId?: number) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.getHealthRecords(batchId);
      }
      const endpoint = batchId ? `/api/batches/${batchId}/health-records` : "/api/health-records";
      const response = await apiRequest("GET", endpoint);
      return response.json();
    },

    async getHealthAssessments(batchId?: number) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.getHealthAssessments(batchId);
      }
      const endpoint = batchId ? `/api/batches/${batchId}/health-assessments` : "/api/health-assessments";
      const response = await apiRequest("GET", endpoint);
      return response.json();
    },

    async createHealthRecord(data: any) {
      if (API_CONFIG.USE_DJANGO_API) {
        return djangoApi.createHealthRecord(data);
      }
      const response = await apiRequest("POST", "/api/health-records", data);
      return response.json();
    }
  }
};
