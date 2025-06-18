import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Activity, Fish, Thermometer } from "lucide-react";
import type { Batch, Container, FarmSite, EnvironmentalReading } from "@shared/schema";

interface BatchContainerViewProps {
  selectedBatch?: Batch;
}

export function BatchContainerView({ selectedBatch }: BatchContainerViewProps) {
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>(selectedBatch?.id.toString() || "all");
  const [containerTypeFilter, setContainerTypeFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("30");

  const { data: farmSites = [] } = useQuery<FarmSite[]>({
    queryKey: ["/api/dashboard/farm-sites"],
  });

  const { data: allBatches = [] } = useQuery<Batch[]>({
    queryKey: ["/api/batches"],
  });

  const { data: containers = [] } = useQuery<Container[]>({
    queryKey: ["/api/containers"],
  });

  const { data: environmentalReadings = [] } = useQuery<EnvironmentalReading[]>({
    queryKey: ["/api/environmental-readings"],
  });

  // Filter batches based on selected site
  const filteredBatches = selectedSite === "all" 
    ? allBatches 
    : allBatches.filter(batch => {
        const container = containers.find(c => c.id === batch.container);
        return container?.name.includes(selectedSite);
      });

  // Get containers for selected batch(es)
  const getContainersForBatch = () => {
    if (selectedBatchFilter === "all") {
      return containers;
    }
    
    const batch = allBatches.find(b => b.id.toString() === selectedBatchFilter);
    if (!batch) return [];
    
    return containers.filter(c => c.id === batch.container);
  };

  const relevantContainers = getContainersForBatch();

  // Filter containers by type
  const filteredContainers = containerTypeFilter === "all" 
    ? relevantContainers
    : relevantContainers.filter(container => {
        const containerType = container.name.toLowerCase();
        return containerType.includes(containerTypeFilter.toLowerCase());
      });

  // Get current environmental conditions for containers
  const getContainerEnvironmentalData = (containerId: number) => {
    const containerReadings = environmentalReadings.filter(reading => 
      reading.container === containerId
    ).slice(0, 3);
    
    return containerReadings;
  };

  // Get batch history for a container
  const getContainerBatchHistory = (containerId: number) => {
    return allBatches.filter(batch => batch.container === containerId);
  };

  return (
    <div className="space-y-6">
      {/* Site & Batch Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Site & Batch Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Site</label>
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger>
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  {farmSites.map((site) => (
                    <SelectItem key={site.id} value={site.name}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Batch</label>
              <Select value={selectedBatchFilter} onValueChange={setSelectedBatchFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {filteredBatches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id.toString()}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Container Type</label>
              <Select value={containerTypeFilter} onValueChange={setContainerTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sea cage">Sea Cages</SelectItem>
                  <SelectItem value="tank">Tanks</SelectItem>
                  <SelectItem value="incubator">Incubators</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Container Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContainers.map((container) => {
          const environmentalData = getContainerEnvironmentalData(container.id);
          const batchHistory = getContainerBatchHistory(container.id);
          const currentBatch = batchHistory.find(b => b.status === "active");

          return (
            <Card key={container.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{container.name}</CardTitle>
                  <Badge variant={currentBatch ? "default" : "secondary"}>
                    {currentBatch ? "Active" : "Available"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {container.containerType} • Capacity: {container.capacity}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Current Batch Info */}
                {currentBatch && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Fish className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Current Batch</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      <p className="text-sm">{currentBatch.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {currentBatch.currentCount.toLocaleString()} fish • {currentBatch.currentBiomassKg} kg
                      </p>
                    </div>
                  </div>
                )}

                {/* Environmental Conditions */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Environmental</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    {environmentalData.length > 0 ? (
                      environmentalData.map((reading, index) => (
                        <p key={index} className="text-xs">
                          {reading.value} {reading.parameter === 1 ? "°C" : reading.parameter === 2 ? "mg/L" : "pH"}
                        </p>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No recent readings</p>
                    )}
                  </div>
                </div>

                {/* Batch History */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="font-medium">History</span>
                  </div>
                  <div className="pl-6">
                    <p className="text-xs text-muted-foreground">
                      {batchHistory.length} batch{batchHistory.length !== 1 ? 'es' : ''} total
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    // TODO: Implement container details modal
                    console.log('View container details for:', container.id);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      {filteredContainers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Container Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{filteredContainers.length}</div>
                <div className="text-sm text-muted-foreground">Total Containers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {filteredContainers.filter(c => 
                    allBatches.some(b => b.container === c.id && b.status === "active")
                  ).length}
                </div>
                <div className="text-sm text-muted-foreground">Active Containers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {filteredContainers.filter(c => c.name.toLowerCase().includes("sea cage")).length}
                </div>
                <div className="text-sm text-muted-foreground">Sea Cages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {filteredContainers.filter(c => c.name.toLowerCase().includes("tank")).length}
                </div>
                <div className="text-sm text-muted-foreground">Tanks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredContainers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No containers match the selected filters.</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}