/**
 * Environmental Monitoring Parameter Cards
 * 
 * TASK 8: Environmental Audit - Demo Component
 * 
 * STATUS: This is a DEMO/PROTOTYPE component using simulated data
 * - Shows simulated real-time water quality parameters
 * - Uses hardcoded initial values and random updates
 * - NOT connected to backend environmental readings API
 * 
 * PRODUCTION TODO:
 * - Replace with useQuery calls to ApiService.apiV1EnvironmentalReadingsList()
 * - Use honest fallbacks (N/A) when no sensor data available
 * - Filter by container/area as needed
 * - Remove simulation logic
 * 
 * HONEST DISCLOSURE: This component is for UI demonstration only
 */

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface WaterParameters {
  temperature: number;
  oxygen: number;
  ph: number;
  salinity: number;
}

interface EnvironmentalData {
  waterFlow: number;
  currentSpeed: number;
  weather: string;
  windSpeed: number;
}

interface SystemStatus {
  feedSystem: string;
  sensors: string;
  netCameras: string;
  dataLogger: string;
}

export default function ParameterCards() {
  const [waterParams, setWaterParams] = useState<WaterParameters>({
    temperature: 14.2,
    oxygen: 8.4,
    ph: 7.1,
    salinity: 34.2,
  });

  const [environmental, setEnvironmental] = useState<EnvironmentalData>({
    waterFlow: 245,
    currentSpeed: 0.8,
    weather: "Partly Cloudy",
    windSpeed: 12,
  });

  const [systemStatus] = useState<SystemStatus>({
    feedSystem: "Online",
    sensors: "All Active",
    netCameras: "1 Offline",
    dataLogger: "Recording",
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWaterParams(prev => ({
        temperature: Math.max(12, Math.min(16, prev.temperature + (Math.random() - 0.5) * 0.2)),
        oxygen: Math.max(7, Math.min(10, prev.oxygen + (Math.random() - 0.5) * 0.1)),
        ph: Math.max(6.5, Math.min(8.5, prev.ph + (Math.random() - 0.5) * 0.05)),
        salinity: Math.max(32, Math.min(36, prev.salinity + (Math.random() - 0.5) * 0.1)),
      }));

      setEnvironmental(prev => ({
        ...prev,
        waterFlow: Math.max(200, Math.min(300, prev.waterFlow + (Math.random() - 0.5) * 10)),
        currentSpeed: Math.max(0.5, Math.min(1.2, prev.currentSpeed + (Math.random() - 0.5) * 0.1)),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getParameterStatus = (param: string, value: number) => {
    switch (param) {
      case "temperature":
        if (value >= 12 && value <= 15) return { status: "Optimal", color: "text-green-600" };
        if (value >= 10 && value <= 17) return { status: "Good", color: "text-green-600" };
        return { status: "Monitor", color: "text-orange-600" };
      
      case "oxygen":
        if (value >= 8) return { status: "Good", color: "text-green-600" };
        if (value >= 6) return { status: "Monitor", color: "text-orange-600" };
        return { status: "Critical", color: "text-red-600" };
      
      case "ph":
        if (value >= 7.0 && value <= 7.5) return { status: "Optimal", color: "text-green-600" };
        if (value >= 6.8 && value <= 8.0) return { status: "Monitor", color: "text-orange-600" };
        return { status: "Critical", color: "text-red-600" };
      
      case "salinity":
        if (value >= 33 && value <= 35) return { status: "Normal", color: "text-green-600" };
        return { status: "Monitor", color: "text-orange-600" };
      
      default:
        return { status: "Unknown", color: "text-gray-600" };
    }
  };

  const getSystemStatusColor = (status: string) => {
    if (status.includes("Online") || status.includes("Active") || status.includes("Recording")) {
      return "bg-green-500";
    }
    if (status.includes("Offline")) {
      return "bg-orange-500";
    }
    return "bg-gray-500";
  };

  return (
    <div className="space-y-4">
      {/* Honest Disclosure Banner - TASK 8 */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>Demo Mode:</strong> This page displays simulated environmental data for UI demonstration. 
          Real sensor integration requires backend environmental readings API. See component documentation for production implementation details.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Parameters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Water Parameters (Simulated)</h3>
          <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Temperature</span>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{waterParams.temperature.toFixed(1)}°C</span>
              <span className={`block text-xs ${getParameterStatus("temperature", waterParams.temperature).color}`}>
                {getParameterStatus("temperature", waterParams.temperature).status}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Dissolved Oxygen</span>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{waterParams.oxygen.toFixed(1)} mg/L</span>
              <span className={`block text-xs ${getParameterStatus("oxygen", waterParams.oxygen).color}`}>
                {getParameterStatus("oxygen", waterParams.oxygen).status}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">pH</span>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{waterParams.ph.toFixed(1)}</span>
              <span className={`block text-xs ${getParameterStatus("ph", waterParams.ph).color}`}>
                {getParameterStatus("ph", waterParams.ph).status}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Salinity</span>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{waterParams.salinity.toFixed(1)} ppt</span>
              <span className={`block text-xs ${getParameterStatus("salinity", waterParams.salinity).color}`}>
                {getParameterStatus("salinity", waterParams.salinity).status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Conditions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental (Simulated)</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Water Flow</span>
            <span className="text-lg font-bold text-gray-900">{Math.round(environmental.waterFlow)} L/min</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Speed</span>
            <span className="text-lg font-bold text-gray-900">{environmental.currentSpeed.toFixed(1)} m/s</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Weather</span>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{environmental.weather}</span>
              <span className="block text-xs text-gray-500">Wind: {environmental.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status (Simulated)</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Feed System</span>
            <span className={`px-2 py-1 text-white text-xs rounded-full ${getSystemStatusColor(systemStatus.feedSystem)}`}>
              {systemStatus.feedSystem}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Sensors</span>
            <span className={`px-2 py-1 text-white text-xs rounded-full ${getSystemStatusColor(systemStatus.sensors)}`}>
              {systemStatus.sensors}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Net Cameras</span>
            <span className={`px-2 py-1 text-white text-xs rounded-full ${getSystemStatusColor(systemStatus.netCameras)}`}>
              {systemStatus.netCameras}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Data Logger</span>
            <span className={`px-2 py-1 text-white text-xs rounded-full ${getSystemStatusColor(systemStatus.dataLogger)}`}>
              {systemStatus.dataLogger}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
