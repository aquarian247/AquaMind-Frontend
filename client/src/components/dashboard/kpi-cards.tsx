import { useDashboardKPIs } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function KPICards() {
  const { data: kpis, isLoading, error } = useDashboardKPIs();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="kpi-card">
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <p className="text-red-800">Failed to load KPI data. Please try refreshing the page.</p>
      </div>
    );
  }

  const kpiData = [
    {
      label: "Total Fish Count",
      value: kpis?.totalFish?.toLocaleString() || "0",
      change: "+12%",
      trend: "up",
      icon: "fas fa-fish",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Health Rate",
      value: `${kpis?.healthRate || 0}%`,
      change: "98.5%",
      trend: "up",
      icon: "fas fa-heart",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Avg Water Temp",
      value: `${kpis?.avgWaterTemp || 0}°C`,
      change: "Optimal",
      trend: "stable",
      icon: "fas fa-thermometer-half",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "Next Feeding",
      value: `${kpis?.nextFeedingHours || 0} hrs`,
      change: "Due Soon",
      trend: "warning",
      icon: "fas fa-utensils",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiData.map((kpi, index) => (
        <div key={index} className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${kpi.iconBg} rounded-lg`}>
              <i className={`${kpi.icon} ${kpi.iconColor} text-xl`}></i>
            </div>
            <span 
              className={`text-sm font-medium ${
                kpi.trend === "up" 
                  ? "text-green-600" 
                  : kpi.trend === "warning" 
                  ? "text-orange-600" 
                  : "text-blue-600"
              }`}
            >
              {kpi.change}
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
          <p className="text-gray-600 text-sm">{kpi.label}</p>
        </div>
      ))}
    </div>
  );
}
