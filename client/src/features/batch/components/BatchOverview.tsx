import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Fish, Search, Filter, Eye, Container as ContainerIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { ExtendedBatch } from "../types";

interface BatchOverviewProps {
  batches: ExtendedBatch[];
  searchTerm: string;
  statusFilter: string;
  stageFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onStageFilterChange: (value: string) => void;
  onBatchSelect: (batch: ExtendedBatch) => void;
  selectedBatch: ExtendedBatch | null;
  isLoading: boolean;
  stages: Array<{ id: number; name: string }>;
}

const getHealthStatusColor = (status: string) => {
  switch (status) {
    case "excellent": return "text-green-600 bg-green-50 border-green-200";
    case "good": return "text-blue-600 bg-blue-50 border-blue-200";
    case "fair": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "poor": return "text-orange-600 bg-orange-50 border-orange-200";
    case "critical": return "text-red-600 bg-red-50 border-red-200";
    default: return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getLifecycleStages = () => [
  { name: "Egg", duration: 100, color: "bg-yellow-400" },
  { name: "Fry", duration: 100, color: "bg-orange-400" },
  { name: "Parr", duration: 100, color: "bg-green-400" },
  { name: "Smolt", duration: 100, color: "bg-blue-400" },
  { name: "Post-Smolt", duration: 100, color: "bg-purple-400" },
  { name: "Adult", duration: 450, color: "bg-red-400" }
];

const calculateDaysActive = (startDate: string) => {
  return Math.floor((new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
};

const getStageProgress = (stageName?: string, daysActive?: number) => {
  if (!stageName || !daysActive) return 0;

  const stages = getLifecycleStages();
  const normalizedStageName = stageName.toLowerCase().trim();
  
  // Use exact match or word boundary matching to prevent "Post-Smolt" from matching "Smolt"
  const currentStageIndex = stages.findIndex(s => {
    const stageLower = s.name.toLowerCase();
    // Special case for Egg/Alevin
    if (stageLower === "egg" && normalizedStageName.includes("alevin")) return true;
    // Exact match or match as complete word
    return normalizedStageName === stageLower || 
           normalizedStageName === stageLower.replace("-", " ") ||
           normalizedStageName === stageLower.replace(" ", "-");
  });

  if (currentStageIndex === -1) return 0;

  // Calculate cumulative days up to current stage
  const cumulativeDays = stages.slice(0, currentStageIndex).reduce((sum, stage) => sum + stage.duration, 0);
  const daysInCurrentStage = daysActive - cumulativeDays;
  const currentStageDuration = stages[currentStageIndex].duration;

  const progress = Math.min((daysInCurrentStage / currentStageDuration) * 100, 100);
  return Math.max(0, progress);
};

const getProgressColor = (progress: number) => {
  if (progress < 60) return "bg-green-500";
  if (progress < 75) return "bg-yellow-500";
  if (progress < 90) return "bg-orange-500";
  return "bg-red-700";
};

export function BatchOverview({
  batches,
  searchTerm,
  statusFilter,
  stageFilter,
  onSearchChange,
  onStatusFilterChange,
  onStageFilterChange,
  onBatchSelect,
  selectedBatch,
  isLoading,
  stages
}: BatchOverviewProps) {
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.species_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter;
    const matchesStage = stageFilter === "all" || batch.current_lifecycle_stage?.name === stageFilter;
    return matchesSearch && matchesStatus && matchesStage;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue>
              {statusFilter === "all" && "All Statuses"}
              {statusFilter === "ACTIVE" && "Active"}
              {statusFilter === "COMPLETED" && "Completed"}
              {statusFilter === "TERMINATED" && "Terminated"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="TERMINATED">Terminated</SelectItem>
          </SelectContent>
        </Select>

        <Select value={stageFilter} onValueChange={onStageFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue>
              {stageFilter === "all" ? "All Stages" : stageFilter}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {stages.map((stage) => (
              <SelectItem key={stage.id} value={stage.name}>
                {stage.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Batch Cards */}
      <div className="space-y-4">
        {filteredBatches.map((batch: ExtendedBatch) => {
          const daysActive = calculateDaysActive(batch.start_date);
          // Placeholder – assume 100 % survival until backend provides initialCount
          const survivalRate = 100;
          const healthStatus = 'excellent'; // Placeholder logic
          const currentBiomass = typeof batch.calculated_biomass_kg === 'string' ? parseFloat(batch.calculated_biomass_kg) : (batch.calculated_biomass_kg || 0);
          // Handle possible undefined population count safely
          const populationCount = batch.calculated_population_count ?? 0;
          const avgWeight = populationCount > 0 ? (currentBiomass * 1000) / populationCount : 0;
          const stageProgress = getStageProgress(batch.current_lifecycle_stage?.name, daysActive);

          return (
            <Card
              key={batch.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md border-l-4 border-l-green-500",
                selectedBatch?.id === batch.id && "ring-2 ring-primary"
              )}
              onClick={() => onBatchSelect(batch)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{batch.batch_number}</h3>
                        <Badge variant="secondary">{batch.status}</Badge>
                        <Badge className={getHealthStatusColor(healthStatus)}>
                          {healthStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{batch.species_name || "Unknown Species"}</span>
                        <span>•</span>
                        <span>{daysActive} days active</span>
                        <span>•</span>
                        <span>Started {format(new Date(batch.start_date), "MMM dd, yyyy")}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant={selectedBatch?.id === batch.id ? "default" : "outline"} 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBatchSelect(batch);
                        }}
                      >
                        {selectedBatch?.id === batch.id ? "✓ Selected" : "Select Batch"}
                      </Button>
                      <Link href={`/batch-details/${batch.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />View Details
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Lifecycle Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Lifecycle Stage: {batch.current_lifecycle_stage?.name || "Not set"}</span>
                      <span className="text-muted-foreground">{stageProgress.toFixed(1)}% through stage</span>
                    </div>
                    <div className="flex space-x-1">
                      {getLifecycleStages().map((stage, index) => {
                        const stages = getLifecycleStages();
                        const normalizedBatchStage = (batch.current_lifecycle_stage?.name || '').toLowerCase().trim();
                        
                        // Use exact match to prevent "Post-Smolt" from matching "Smolt"
                        const currentStageIndex = stages.findIndex(s => {
                          const stageLower = s.name.toLowerCase();
                          // Special case for Egg/Alevin
                          if (stageLower === "egg" && normalizedBatchStage.includes("alevin")) return true;
                          // Exact match or match as complete word
                          return normalizedBatchStage === stageLower || 
                                 normalizedBatchStage === stageLower.replace("-", " ") ||
                                 normalizedBatchStage === stageLower.replace(" ", "-");
                        });
                        
                        const isCurrentStage = currentStageIndex === index;
                        const isCompleted = currentStageIndex > index;

                        return (
                          <div key={stage.name} className="flex-1 space-y-1">
                            <div className={cn(
                              "h-3 rounded-full relative overflow-hidden",
                              "bg-gray-200"
                            )}>
                              {isCompleted && (
                                <div className="absolute inset-0 bg-green-400 rounded-full" />
                              )}
                              {isCurrentStage && (
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    getProgressColor(stageProgress)
                                  )}
                                  style={{ width: `${stageProgress}%` }}
                                />
                              )}
                            </div>
                            <div className="text-xs text-center truncate px-1">{stage.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {(batch.calculated_population_count ?? 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Fish Count</div>
                    </div>

                    <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {currentBiomass.toFixed(1)}kg
                      </div>
                      <div className="text-xs text-muted-foreground">Biomass</div>
                    </div>

                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {survivalRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Survival</div>
                    </div>

                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {avgWeight.toFixed(0)}g
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Weight</div>
                    </div>
                  </div>

                  {/* Container Distribution Indicator */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ContainerIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Container Distribution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        {/* Mock container status indicators */}
                        <div className="w-3 h-3 rounded-full bg-green-500" title="Healthy container" />
                        <div className="w-3 h-3 rounded-full bg-green-500" title="Healthy container" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" title="Warning container" />
                      </div>
                      <span className="text-sm text-muted-foreground">3 containers</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
