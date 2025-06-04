import { useEffect, useRef } from "react";
import { useFishGrowthChart } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";
import Chart from "chart.js/auto";

export default function FishGrowthChart() {
  const { data: chartData, isLoading, error } = useFishGrowthChart();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartData || !chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets.map(dataset => ({
          ...dataset,
          borderRadius: 4,
          borderWidth: 1,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Weight (kg)",
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Fish Growth Rate</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg">Weight</button>
            <button className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg">Length</button>
          </div>
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Fish Growth Rate</h3>
        </div>
        <div className="h-80 flex items-center justify-center text-red-600">
          Failed to load fish growth data
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Fish Growth Rate</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg">Weight</button>
          <button className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg">Length</button>
        </div>
      </div>
      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
