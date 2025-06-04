import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useDashboardKPIs() {
  return useQuery({
    queryKey: ["/api/dashboard/kpis"],
    queryFn: () => api.getDashboardKPIs(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useFarmSites() {
  return useQuery({
    queryKey: ["/api/dashboard/farm-sites"],
    queryFn: () => api.getFarmSites(),
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useActiveAlerts() {
  return useQuery({
    queryKey: ["/api/dashboard/alerts"],
    queryFn: () => api.getActiveAlerts(),
    refetchInterval: 15000, // Refetch every 15 seconds
  });
}

export function useWaterQualityChart(farmSiteId = 1) {
  return useQuery({
    queryKey: ["/api/charts/water-quality", farmSiteId],
    queryFn: () => api.getWaterQualityChart(farmSiteId),
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useFishGrowthChart() {
  return useQuery({
    queryKey: ["/api/charts/fish-growth"],
    queryFn: () => api.getFishGrowthChart(),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}
