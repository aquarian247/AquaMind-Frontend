import ParameterCards from "@/components/monitoring/parameter-cards";
import RealTimeChart from "@/components/monitoring/real-time-chart";

export default function Monitoring() {
  return (
    <div className="space-y-6">
      {/* Real-time Monitoring Grid */}
      <ParameterCards />

      {/* Live Data Chart */}
      <RealTimeChart />
    </div>
  );
}
