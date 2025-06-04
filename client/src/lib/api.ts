import { apiRequest } from "./queryClient";

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

export const api = {
  // Dashboard endpoints
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    const response = await apiRequest("GET", "/api/dashboard/kpis");
    return response.json();
  },

  async getFarmSites() {
    const response = await apiRequest("GET", "/api/dashboard/farm-sites");
    return response.json();
  },

  async getActiveAlerts() {
    const response = await apiRequest("GET", "/api/dashboard/alerts");
    return response.json();
  },

  // Chart data endpoints
  async getWaterQualityChart(farmSiteId = 1): Promise<ChartData> {
    const response = await apiRequest("GET", `/api/charts/water-quality?farmSiteId=${farmSiteId}`);
    return response.json();
  },

  async getFishGrowthChart(): Promise<ChartData> {
    const response = await apiRequest("GET", "/api/charts/fish-growth");
    return response.json();
  },

  // Farm management endpoints
  async getPensByFarmSite(farmSiteId: number) {
    const response = await apiRequest("GET", `/api/farm-sites/${farmSiteId}/pens`);
    return response.json();
  },

  // Water quality endpoints
  async getWaterQualityReadings(farmSiteId: number, limit = 50) {
    const response = await apiRequest("GET", `/api/farm-sites/${farmSiteId}/water-quality?limit=${limit}`);
    return response.json();
  },

  // Alerts endpoints
  async getAllAlerts(activeOnly = false) {
    const response = await apiRequest("GET", `/api/alerts?active=${activeOnly}`);
    return response.json();
  },

  async resolveAlert(alertId: number) {
    const response = await apiRequest("PATCH", `/api/alerts/${alertId}/resolve`);
    return response.json();
  },
};
