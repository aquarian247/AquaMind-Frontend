import { useState } from "react";
import { Fish, BarChart3, Container, Stethoscope, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { BatchContainerView } from "@/components/batch-management/BatchContainerView";
import { BatchHealthView } from "@/components/batch-management/BatchHealthView";
import { BatchAnalyticsView } from "@/components/batch-management/BatchAnalyticsView";
import { BatchFeedHistoryView } from "@/components/batch-management/BatchFeedHistoryView";
import { BatchKPIs } from "@/features/batch/components/BatchKPIs";
import { BatchOverview } from "@/features/batch/components/BatchOverview";
import { useBatchData } from "@/features/batch/hooks/useBatchData";
import { useBatchKPIs } from "@/features/batch/hooks/useBatchKPIs";
import { useBatchFilters } from "../hooks/useBatchFilters";
import { CreateBatchDialog } from "../components/CreateBatchDialog";
import { mapExtendedToBatch } from "@/features/batch/types";
import type { ExtendedBatch } from "@/features/batch/types";

// Helper component for "select batch" placeholder
const SelectBatchPlaceholder = ({ message }: { message: string }) => (
  <Card>
    <CardContent className="p-12 text-center space-y-3">
      <Fish className="h-12 w-12 mx-auto text-muted-foreground/50" />
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
      <p className="text-sm text-muted-foreground/70">Click the "Select Batch" button on any batch card in the Overview tab</p>
    </CardContent>
  </Card>
);

/**
 * Batch Management shell page - orchestrates tab navigation, batch selection, and data fetching
 * Business logic delegated to hooks: useBatchData, useBatchKPIs, useBatchFilters
 */
export default function BatchManagementPage() {
  const [selectedBatch, setSelectedBatch] = useState<ExtendedBatch | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("ACTIVE"); // Default to ACTIVE
  const isMobile = useIsMobile();

  // Data hooks - pass status filter to API
  const { batches, species, stages, containers, broodstockPairs, eggSuppliers, isLoading, batchesLoading } = useBatchData("all", statusFilter);
  const { kpis } = useBatchKPIs(batches);
  const { 
    searchTerm, 
    setSearchTerm, 
    stageFilter, 
    setStageFilter, 
    filteredBatches 
  } = useBatchFilters(batches, stages);

  // Loading state
  if (batchesLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Batch Management</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Fish className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Batch Management</h1>
            <p className="text-muted-foreground">
              Track and manage fish batches throughout their lifecycle
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CreateBatchDialog />
        </div>
      </div>

      {/* KPI Cards */}
      <BatchKPIs kpis={kpis} isLoading={isLoading} />

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <div className="mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {activeTab === "overview" && "Overview"}
                  {activeTab === "containers" && "Containers"}
                  {activeTab === "medical" && "Medical Journal"}
                  {activeTab === "feed" && "Feed History"}
                  {activeTab === "analytics" && "Analytics"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="containers">Containers</SelectItem>
                <SelectItem value="medical">Medical Journal</SelectItem>
                <SelectItem value="feed">Feed History</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="containers">
              <Container className="w-4 h-4 mr-2" />
              Containers
            </TabsTrigger>
            <TabsTrigger value="medical">
              <Stethoscope className="w-4 h-4 mr-2" />
              Medical
            </TabsTrigger>
            <TabsTrigger value="feed">
              <TrendingUp className="w-4 h-4 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="overview">
          <BatchOverview
            batches={filteredBatches}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            stageFilter={stageFilter}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onStageFilterChange={setStageFilter}
            onBatchSelect={setSelectedBatch}
            selectedBatch={selectedBatch}
            isLoading={batchesLoading}
            stages={stages}
          />
        </TabsContent>

        <TabsContent value="containers">
          {selectedBatch ? (
            <BatchContainerView selectedBatch={mapExtendedToBatch(selectedBatch)} />
          ) : (
            <SelectBatchPlaceholder message="Select a batch from the overview list to view its containers." />
          )}
        </TabsContent>

        <TabsContent value="medical">
          {selectedBatch ? (
            <BatchHealthView batchId={selectedBatch.id} batchName={selectedBatch.batch_number} />
          ) : (
            <SelectBatchPlaceholder message="Select a batch from the overview list to view its medical journal." />
          )}
        </TabsContent>

        <TabsContent value="feed">
          {selectedBatch ? (
            <BatchFeedHistoryView batchId={selectedBatch.id} batchName={selectedBatch.batch_number} />
          ) : (
            <SelectBatchPlaceholder message="Select a batch from the overview list to view its feed history." />
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {selectedBatch ? (
            <BatchAnalyticsView batchId={selectedBatch.id} batchName={selectedBatch.batch_number} />
          ) : (
            <SelectBatchPlaceholder message="Select a batch from the overview list to view analytics." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

