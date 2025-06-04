import KPICards from "@/components/dashboard/kpi-cards";
import WaterQualityChart from "@/components/dashboard/water-quality-chart";
import FishGrowthChart from "@/components/dashboard/fish-growth-chart";
import FarmSitesStatus from "@/components/dashboard/farm-sites-status";
import RecentAlerts from "@/components/dashboard/recent-alerts";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KPICards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <WaterQualityChart />
        <FishGrowthChart />
      </div>

      {/* Farm Sites and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <FarmSitesStatus />
        <RecentAlerts />
      </div>
    </div>
  );
}
