/**
 * Real-Time Environmental Monitoring Chart
 * 
 * TASK 8: Environmental Audit - Demo Component
 * 
 * STATUS: This is a DEMO/PROTOTYPE component using simulated data
 * - Shows simulated real-time temperature and oxygen readings
 * - Uses random data generation for visualization purposes
 * - NOT connected to backend environmental readings API
 * 
 * PRODUCTION TODO:
 * - Replace with streaming data from ApiService.apiV1EnvironmentalReadingsRecentRetrieve()
 * - Use honest fallbacks (N/A or empty chart) when no data available
 * - Add real-time updates via WebSocket or polling
 * - Remove simulation logic
 * 
 * HONEST DISCLOSURE: This component is for UI demonstration only
 */

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Chart from "chart.js/auto";

interface RealTimeData {
  temperature: number;
  oxygen: number;
  timestamp: Date;
}

export default function RealTimeChart() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<RealTimeData[]>([]);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Simulate real-time data (DEMO ONLY - TASK 8)
  useEffect(() => {
    const generateInitialData = () => {
      const initialData: RealTimeData[] = [];
      for (let i = 19; i >= 0; i--) {
        initialData.push({
          temperature: 12.5 + Math.random() * 1.5,
          oxygen: 8.0 + Math.random() * 1.0,
          timestamp: new Date(Date.now() - i * 60000), // Every minute
        });
      }
      setData(initialData);
      setIsLoading(false);
    };

    generateInitialData();

    // Update data every 30 seconds
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)];
        newData.push({
          temperature: 12.5 + Math.random() * 1.5,
          oxygen: 8.0 + Math.random() * 1.0,
          timestamp: new Date(),
        });
        return newData;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!data.length || !chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map(d => d.timestamp.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })),
        datasets: [
          {
            label: "Temperature (°C)",
            data: data.map(d => d.temperature),
            borderColor: "#1976D2",
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Oxygen (mg/L)",
            data: data.map(d => d.oxygen),
            borderColor: "#00ACC1",
            backgroundColor: "rgba(0, 172, 193, 0.1)",
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Time",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Value",
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
  }, [data]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Real-time Water Quality</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg">Live</button>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg">1H</button>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg">24H</button>
          </div>
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Real-time Water Quality</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg">Live</button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg">1H</button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg">24H</button>
        </div>
      </div>
      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
