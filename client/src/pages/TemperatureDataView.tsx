/**
 * Temperature Data Visualization Page
 * 
 * TASK 8: Environmental Audit - Acceptable Client-Side Processing
 * 
 * This component fetches temperature profile data from backend and processes it for display.
 * Client-side statistics (avg, min, max) are acceptable because:
 * - Data is already loaded from backend (single API call)
 * - Processing is for visualization only, not aggregating multiple endpoints
 * - Calculations are simple stats on existing dataset
 * 
 * HONEST FALLBACKS: Handles empty datasets with zero values (could enhance with N/A if needed)
 */

import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Thermometer, ArrowLeft, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatFallback } from "@/lib/formatFallback";

interface TemperatureReading {
  id: number;
  profileId: number;
  readingDate: string;
  temperature: string;
  createdAt: string;
}

interface TemperatureProfile {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function TemperatureDataView() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: profile } = useQuery<TemperatureProfile>({
    queryKey: [`/api/v1/scenario/temperature-profiles/${id}/`],
    enabled: !!id,
  });

  const { data: readings } = useQuery<{ results: TemperatureReading[] }>({
    queryKey: [`/api/v1/scenario/temperature-profiles/${id}/readings/`],
    enabled: !!id,
  });

  if (!profile || !readings) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/scenario-planning")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scenario Planning
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading temperature data...</div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = readings.results
    .sort((a, b) => new Date(a.readingDate).getTime() - new Date(b.readingDate).getTime())
    .map((reading) => ({
      date: reading.readingDate,
      temperature: parseFloat(reading.temperature),
      month: new Date(reading.readingDate).toLocaleDateString('en-US', { month: 'short' }),
    }));

  // Calculate statistics (client-side processing of loaded data - acceptable for visualization)
  // TASK 8: This is OK because it's processing already-loaded backend data, not aggregating from multiple API calls
  const temperatures = chartData.map(d => d.temperature);
  const avgTemp = temperatures.length > 0 ? temperatures.reduce((a, b) => a + b, 0) / temperatures.length : 0;
  const minTemp = temperatures.length > 0 ? Math.min(...temperatures) : 0;
  const maxTemp = temperatures.length > 0 ? Math.max(...temperatures) : 0;
  const tempRange = temperatures.length > 0 ? maxTemp - minTemp : 0;

  const getTrendIcon = () => {
    if (tempRange < 2) return <Minus className="h-4 w-4" />;
    const firstHalf = temperatures.slice(0, Math.floor(temperatures.length / 2));
    const secondHalf = temperatures.slice(Math.floor(temperatures.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    return secondAvg > firstAvg ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/scenario-planning")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scenario Planning
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Thermometer className="h-8 w-8" />
              {profile.name}
            </h1>
            <p className="text-muted-foreground">Temperature data visualization and analysis</p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {readings.results.length} readings
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFallback(temperatures.length > 0 ? avgTemp.toFixed(1) : null, "°C", { isZeroValid: false })}
            </div>
            <p className="text-xs text-muted-foreground">
              {temperatures.length > 0 ? "Across all readings" : "No data available"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature Range</CardTitle>
            {getTrendIcon()}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFallback(temperatures.length > 0 ? tempRange.toFixed(1) : null, "°C", { isZeroValid: true })}
            </div>
            <p className="text-xs text-muted-foreground">
              {temperatures.length > 0 ? `${minTemp.toFixed(1)}°C to ${maxTemp.toFixed(1)}°C` : "No data available"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minimum Temperature</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatFallback(temperatures.length > 0 ? minTemp.toFixed(1) : null, "°C", { isZeroValid: false })}
            </div>
            <p className="text-xs text-muted-foreground">
              {temperatures.length > 0 ? "Lowest recorded value" : "No data available"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maximum Temperature</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatFallback(temperatures.length > 0 ? maxTemp.toFixed(1) : null, "°C", { isZeroValid: false })}
            </div>
            <p className="text-xs text-muted-foreground">
              {temperatures.length > 0 ? "Highest recorded value" : "No data available"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Temperature Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature Profile Chart</CardTitle>
          <p className="text-sm text-muted-foreground">
            {temperatures.length > 0 
              ? `Temperature readings over time for ${profile.name}` 
              : "No temperature data available for this profile"
            }
          </p>
        </CardHeader>
        <CardContent>
          {temperatures.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Thermometer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No temperature readings available</p>
                <p className="text-sm mt-2">Add readings to see the temperature profile chart</p>
              </div>
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}°C`, 'Temperature']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature Readings</CardTitle>
          <p className="text-sm text-muted-foreground">
            {temperatures.length > 0 
              ? "Complete dataset of temperature measurements" 
              : "No temperature measurements available"
            }
          </p>
        </CardHeader>
        <CardContent>
          {temperatures.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p>No temperature readings to display</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Date</th>
                  <th className="text-left p-2 font-medium">Temperature</th>
                  <th className="text-left p-2 font-medium">Month</th>
                  <th className="text-left p-2 font-medium">Relative Change</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((reading, index) => {
                  const prevTemp = index > 0 ? chartData[index - 1].temperature : reading.temperature;
                  const change = reading.temperature - prevTemp;
                  const changeIcon = change > 0.1 ? (
                    <TrendingUp className="h-3 w-3 text-red-500" />
                  ) : change < -0.1 ? (
                    <TrendingDown className="h-3 w-3 text-blue-500" />
                  ) : (
                    <Minus className="h-3 w-3 text-muted-foreground" />
                  );

                  return (
                    <tr key={reading.date} className="border-b hover:bg-muted/50">
                      <td className="p-2">{new Date(reading.date).toLocaleDateString()}</td>
                      <td className="p-2 font-mono">{reading.temperature.toFixed(1)}°C</td>
                      <td className="p-2">{reading.month}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {changeIcon}
                          <span className="text-sm">
                            {index === 0 ? 'Baseline' : `${change > 0 ? '+' : ''}${change.toFixed(1)}°C`}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
