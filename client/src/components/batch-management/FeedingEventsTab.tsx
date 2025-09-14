import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Utensils,
  CalendarIcon,
  MapPin,
  Package,
  DollarSign,
  Loader2
} from "lucide-react";
import { format } from "date-fns";

interface FeedingEvent {
  id: number;
  feedingDate: string;
  feedingTime: string;
  amountKg: number;
  feedType: string;
  feedBrand: string;
  containerName: string;
  batchBiomassKg: number;
  feedCost: number;
  method: string;
  notes?: string;
  recordedBy: string;
}

interface FeedingEventsTabProps {
  filteredEvents: FeedingEvent[];
  feedTypeFilter: string;
  setFeedTypeFilter: (value: string) => void;
  containerFilter: string;
  setContainerFilter: (value: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalEvents: number;
  isLoadingFeedingEvents: boolean;
  allFeedTypes: string[];
  isLoadingFeedTypes: boolean;
  allContainers: string[];
  isLoadingContainers: boolean;
}

export function FeedingEventsTab({
  filteredEvents,
  feedTypeFilter,
  setFeedTypeFilter,
  containerFilter,
  setContainerFilter,
  currentPage,
  setCurrentPage,
  totalPages,
  totalEvents,
  isLoadingFeedingEvents,
  allFeedTypes,
  isLoadingFeedTypes,
  allContainers,
  isLoadingContainers,
}: FeedingEventsTabProps) {
  const getFeedingMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case "automatic": return "bg-green-100 text-green-700 border-green-200";
      case "manual": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Select value={feedTypeFilter} onValueChange={setFeedTypeFilter} disabled={isLoadingFeedTypes}>
          <SelectTrigger className="w-[180px]">
            {isLoadingFeedTypes ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading feed types...</span>
              </div>
            ) : (
              <SelectValue placeholder="Feed Type" />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Feed Types ({allFeedTypes.length})</SelectItem>
            {allFeedTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={containerFilter} onValueChange={setContainerFilter} disabled={isLoadingContainers}>
          <SelectTrigger className="w-[180px]">
            {isLoadingContainers ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading containers...</span>
              </div>
            ) : (
              <SelectValue placeholder="Container" />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Containers ({allContainers.length})</SelectItem>
            {allContainers.map(container => (
              <SelectItem key={container} value={container}>{container}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isLoadingFeedingEvents ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="text-lg">Loading feeding events...</span>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No feeding events found for the selected filters.</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold">{event.amountKg} kg</span>
                      </div>
                      <Badge variant="outline">{event.feedType}</Badge>
                      <Badge className={getFeedingMethodColor(event.method)}>
                        {event.method}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {format(new Date(event.feedingDate), "MMM dd")} at {event.feedingTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.containerName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {event.feedBrand}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${event.feedCost ? Number(event.feedCost).toFixed(2) : '0.00'}
                      </div>
                    </div>

                    {event.notes && (
                      <p className="text-sm text-muted-foreground">{event.notes}</p>
                    )}
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-sm text-muted-foreground">Biomass</div>
                    <div className="font-semibold">{Number(event.batchBiomassKg).toFixed(2)} kg</div>
                    <div className="text-xs text-muted-foreground">
                      {((Number(event.amountKg) / Number(event.batchBiomassKg)) * 100).toFixed(2)}% of biomass
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing page {currentPage} of {totalPages} ({totalEvents} total events)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1 || isLoadingFeedingEvents}
              >
                Previous
              </Button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    disabled={isLoadingFeedingEvents}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages || isLoadingFeedingEvents}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
