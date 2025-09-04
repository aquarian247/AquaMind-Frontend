import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiService } from "@/api/generated";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Factory,
  Fish,
  Activity,
  Gauge,
  Thermometer,
  Droplet,
  Wind,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Camera,
  Settings,
  Zap,
  Timer,
  Scale
} from "lucide-react";
import { useLocation } from "wouter";
import { FCRSummaryCard } from "@/components/batch-management/FCRSummaryCard";
import { FCRTrendChart } from "@/components/batch-management/FCRTrendChart";
import { useContainerFCRAnalytics } from "@/hooks/use-fcr-analytics";

interface ContainerDetail {
  id: number;
  name: string;
  hallId: number;
  hallName: string;
  stationId: number;
  stationName: string;
  type: "Tray" | "Fry Tank" | "Parr Tank" | "Smolt Tank" | "Post-Smolt Tank";
  stage: "Egg&Alevin" | "Fry" | "Parr" | "Smolt" | "Post-Smolt";
  status: string;
  biomass: number;
  capacity: number;
  fishCount: number;
  averageWeight: number;
  temperature: number;
  oxygenLevel: number;
  flowRate: number;
  lastMaintenance: string;
  systemStatus: string;
  density: number;
  feedingSchedule: string;
  // Additional detail fields
  volume: number;
  installDate: string;
  lastFeedingTime: string;
  dailyFeedAmount: number;
  mortalityRate: number;
  feedConversionRatio: number;
  pH: number;
  salinity: number;
  lightingSchedule: string;
  waterExchangeRate: number;
  powerConsumption: number;
  filtrationSystem: string;
  lastCleaning: string;
  nextScheduledMaintenance: string;
}

export default function ContainerDetail({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const containerId = params.id;

  // FCR Analytics for this container
  const {
    containerTrendsData,
    isLoading: fcrLoading,
    error: fcrError,
    refresh: refreshFCR,
    isRefreshing: fcrRefreshing
  } = useContainerFCRAnalytics(Number(containerId));

  const { data: containerData, isLoading } = useQuery({
    queryKey: ["container", containerId],
    queryFn: async () => {
      const raw = await ApiService.apiV1InfrastructureContainersRetrieve(
        Number(containerId),
      );

      const capacity = parseFloat((raw as any).volume_m3 ?? "0") || 0;

      return {
        id: raw.id,
        name: raw.name,
        hallId: (raw as any).hall ?? 0,
        hallName: (raw as any).hall_name ?? "",
        stationId: 0,
        stationName: (raw as any).hall_name ?? "",
        type: ((raw as any).container_type_name ?? "Tank") as any,
        stage: "Smolt",
        status: raw.active ? "active" : "inactive",
        biomass: 0,
        capacity,
        fishCount: 0,
        averageWeight: 0,
        temperature: 0,
        oxygenLevel: 0,
        flowRate: 0,
        lastMaintenance: new Date().toISOString(),
        systemStatus: "optimal",
        density: 0,
        feedingSchedule: "08:00, 12:00, 16:00",
        volume: capacity,
        installDate: (raw as any).created_at,
        lastFeedingTime: new Date().toISOString(),
        dailyFeedAmount: 0,
        mortalityRate: 0,
        feedConversionRatio: 0,
        pH: 7.2,
        salinity: 0,
        lightingSchedule: "12L:12D",
        waterExchangeRate: 0,
        powerConsumption: 0,
        filtrationSystem: "Standard",
        lastCleaning: new Date().toISOString(),
        nextScheduledMaintenance: new Date().toISOString(),
      } as ContainerDetail;
    },
  });

  // `containerData` may be undefined until the query resolves, so reflect that in the type.
  const container = containerData as ContainerDetail | undefined;

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-200",
      maintenance: "bg-yellow-100 text-yellow-800 border-yellow-200",
      inactive: "bg-red-100 text-red-800 border-red-200"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      "Tray": "bg-purple-100 text-purple-800",
      "Fry Tank": "bg-blue-100 text-blue-800",
      "Parr Tank": "bg-cyan-100 text-cyan-800",
      "Smolt Tank": "bg-green-100 text-green-800",
      "Post-Smolt Tank": "bg-orange-100 text-orange-800"
    };
    return variants[type as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getStageIcon = (stage: string) => {
    const icons = {
      "Egg&Alevin": "🥚",
      "Fry": "🐟",
      "Parr": "🐠",
      "Smolt": "🐟",
      "Post-Smolt": "🐡"
    };
    return icons[stage as keyof typeof icons] || "🐟";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!container) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="ghost" onClick={() => setLocation("/infrastructure/stations")} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Container Not Found</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Container details not available</h3>
            <p className="text-muted-foreground text-center">
              The requested container could not be found or may have been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            onClick={() => setLocation(`/infrastructure/halls/${container.hallId}`)} 
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Hall Detail</span>
          </Button>
          <Factory className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <span className="mr-2">{getStageIcon(container.stage)}</span>
              {container.name}
            </h1>
            <p className="text-muted-foreground">
              {container.hallName} • {container.stationName} • {container.stage} Stage
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Badge className={getStatusBadge(container.status)}>
            {container.status}
          </Badge>
          <Badge className={getTypeBadge(container.type)}>
            {container.type}
          </Badge>
          <Button variant="outline">
            <Camera className="h-4 w-4 mr-2" />
            Live Feed
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Biomass</CardTitle>
            <Fish className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{container.biomass} kg</div>
            <p className="text-xs text-muted-foreground">of {container.capacity} kg capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fish Count</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{container.fishCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">individual fish</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Usage</CardTitle>
            <Gauge className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((container.biomass / container.capacity) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">utilization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Weight</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{container.averageWeight}</div>
            <p className="text-xs text-muted-foreground">grams per fish</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fcr">FCR Analytics</TabsTrigger>
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Factory className="h-5 w-5 mr-2" />
                  Container Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type</span>
                    <div className="font-medium">{container.type}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stage</span>
                    <div className="font-medium">{container.stage}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Volume</span>
                    <div className="font-medium">{container.volume?.toLocaleString() || 'N/A'} L</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Density</span>
                    <div className="font-medium">{container.density} kg/m³</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Filtration</span>
                    <div className="font-medium">{container.filtrationSystem || 'Standard'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Power Usage</span>
                    <div className="font-medium">{container.powerConsumption || 'N/A'} kW</div>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">System Status</span>
                    <Badge variant="outline" className={container.systemStatus === 'optimal' ? 'text-green-700' : 'text-yellow-700'}>
                      {container.systemStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Fish className="h-5 w-5 mr-2" />
                  Production Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mortality Rate</span>
                    <span className="font-medium">{container.mortalityRate?.toFixed(2) || '0.12'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Feed Conversion Ratio</span>
                    <span className="font-medium">{container.feedConversionRatio?.toFixed(2) || '0.95'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily Feed Amount</span>
                    <span className="font-medium">{container.dailyFeedAmount?.toFixed(1) || '12.5'} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Feeding Schedule</span>
                    <span className="font-medium">{container.feedingSchedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Feeding</span>
                    <span className="font-medium">
                      {container.lastFeedingTime ? new Date(container.lastFeedingTime).toLocaleTimeString() : '08:30'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Thermometer className="h-5 w-5 mr-2" />
                  Water Quality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Thermometer className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">
                      {container.temperature?.toFixed(1)}°C
                    </div>
                    <div className="text-xs text-muted-foreground">Temperature</div>
                  </div>
                  <div className="text-center p-4 bg-cyan-50 rounded-lg">
                    <Droplet className="h-6 w-6 mx-auto mb-2 text-cyan-600" />
                    <div className="text-2xl font-bold text-cyan-600">
                      {container.oxygenLevel?.toFixed(1)} mg/L
                    </div>
                    <div className="text-xs text-muted-foreground">Dissolved Oxygen</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Activity className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">
                      {container.pH?.toFixed(1) || '7.2'}
                    </div>
                    <div className="text-xs text-muted-foreground">pH Level</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Wind className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-purple-600">
                      {container.flowRate?.toFixed(1)} L/min
                    </div>
                    <div className="text-xs text-muted-foreground">Flow Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  System Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Water Exchange Rate</span>
                    <span className="font-medium">{container.waterExchangeRate?.toFixed(1) || '15.2'}%/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Salinity</span>
                    <span className="font-medium">{container.salinity?.toFixed(1) || '0.5'}‰</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Lighting Schedule</span>
                    <span className="font-medium">{container.lightingSchedule || '12L:12D'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Power Consumption</span>
                    <span className="font-medium">{container.powerConsumption || '2.1'} kW</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fcr" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* FCR Summary Card */}
            <div className="lg:col-span-1">
              <FCRSummaryCard
                data={{
                  currentFCR: container?.feedConversionRatio || null,
                  confidenceLevel: 'MEDIUM', // Mock confidence for container level
                  trend: 'stable',
                  lastUpdated: new Date(),
                  comparisonPeriod: 'Last 30 days',
                  predictedFCR: null,
                  deviation: null,
                  scenariosUsed: 0
                }}
                onRefresh={refreshFCR}
                isLoading={fcrLoading}
              />
            </div>

            {/* FCR Trend Chart */}
            <div className="lg:col-span-2">
              <FCRTrendChart
                data={containerTrendsData}
                title={`FCR Trends - ${container?.name || 'Container'}`}
                isLoading={fcrLoading}
                error={fcrError?.message}
                onRefresh={refreshFCR}
                showConfidenceIndicators={true}
              />
            </div>
          </div>

          {/* Container FCR Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-500" />
                Container Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <Scale className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      Container-Specific FCR Tracking
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                      This view shows FCR performance specific to {container?.name}. Container-level FCR helps identify
                      equipment-specific issues and optimize individual unit performance.
                    </p>
                  </div>
                </div>

                {container?.feedConversionRatio && container.feedConversionRatio > 1.5 && (
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                        High FCR Detected
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-1">
                        Current FCR ({container.feedConversionRatio.toFixed(2)}) is above optimal levels.
                        Consider checking feed distribution, water quality, or maintenance schedules.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {container?.biomass || 0}kg
                    </div>
                    <div className="text-xs text-muted-foreground">Current Biomass</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {container?.fishCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Fish Count</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {container?.dailyFeedAmount?.toFixed(1) || '0.0'}kg
                    </div>
                    <div className="text-xs text-muted-foreground">Daily Feed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operational Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Installed</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {container.installDate ? new Date(container.installDate).toLocaleDateString() : 'Jan 20, 2023'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Last Feeding</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {container.lastFeedingTime ? new Date(container.lastFeedingTime).toLocaleString() : 'Today, 08:30'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Last Cleaning</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {container.lastCleaning ? new Date(container.lastCleaning).toLocaleDateString() : 'Dec 18, 2024'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">Last Maintenance</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(container.lastMaintenance).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">Next Scheduled Maintenance</div>
                    <div className="text-sm text-muted-foreground">
                      {container.nextScheduledMaintenance ? new Date(container.nextScheduledMaintenance).toLocaleDateString() : 'Jan 15, 2025'}
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    Scheduled
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Regular maintenance ensures optimal fish welfare and system performance. 
                  Maintenance includes filter cleaning, system checks, and equipment calibration.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
