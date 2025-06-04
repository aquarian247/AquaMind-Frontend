import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "chart.js/auto";

export default function Analytics() {
  const growthChartRef = useRef<HTMLCanvasElement>(null);
  const feedEfficiencyChartRef = useRef<HTMLCanvasElement>(null);
  const growthChartInstance = useRef<Chart | null>(null);
  const feedChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Growth Performance Chart
    if (growthChartRef.current) {
      const ctx = growthChartRef.current.getContext("2d");
      if (ctx) {
        if (growthChartInstance.current) {
          growthChartInstance.current.destroy();
        }
        
        growthChartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [{
              label: "Average Weight (kg)",
              data: [2.8, 3.0, 3.1, 3.2],
              backgroundColor: "#1976D2",
              borderRadius: 4,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        });
      }
    }

    // Feed Efficiency Chart
    if (feedEfficiencyChartRef.current) {
      const ctx = feedEfficiencyChartRef.current.getContext("2d");
      if (ctx) {
        if (feedChartInstance.current) {
          feedChartInstance.current.destroy();
        }
        
        feedChartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{
              label: "FCR",
              data: [1.35, 1.28, 1.22, 1.20, 1.18, 1.24],
              borderColor: "#FF6F00",
              backgroundColor: "rgba(255, 111, 0, 0.1)",
              tension: 0.4,
              fill: true,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        });
      }
    }

    return () => {
      if (growthChartInstance.current) {
        growthChartInstance.current.destroy();
      }
      if (feedChartInstance.current) {
        feedChartInstance.current.destroy();
      }
    };
  }, []);

  const kpis = [
    {
      label: "Survival Rate",
      value: "96.8%",
      change: "↑ 2.1% vs target",
      changeColor: "text-green-600",
    },
    {
      label: "SGR (Specific Growth Rate)",
      value: "1.24",
      change: "↑ 0.05% this week",
      changeColor: "text-green-600",
    },
    {
      label: "Feed Conversion Ratio",
      value: "1.18",
      change: "↑ 0.02% vs target",
      changeColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <canvas ref={growthChartRef}></canvas>
            </div>
          </CardContent>
        </Card>

        {/* Feed Efficiency Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Feed Efficiency Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <canvas ref={feedEfficiencyChartRef}></canvas>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kpis.map((kpi, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{kpi.value}</p>
                <p className="text-sm text-gray-600 mt-2">{kpi.label}</p>
                <p className={`text-xs mt-1 ${kpi.changeColor}`}>{kpi.change}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
