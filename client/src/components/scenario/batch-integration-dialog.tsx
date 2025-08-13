import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fish, Search, Calendar, Scale, Users } from "lucide-react";
import { format } from "date-fns";

interface BatchIntegrationDialogProps {
  children: React.ReactNode;
  onBatchSelected?: (batch: any) => void;
}

interface Batch {
  id: number;
  name: string;
  species: string;
  genotype: string;
  supplier: string;
  currentStage: string;
  currentCount: number;
  averageWeight: number;
  location: string;
  dateStarted: string;
  status: string;
}

export function BatchIntegrationDialog({ children, onBatchSelected }: BatchIntegrationDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  // Fetch available batches
  const { data: batches, isLoading } = useQuery<Batch[]>({
    queryKey: ["/api/batches", { search: searchTerm, status: statusFilter }],
    queryFn: () => {
      // Mock batch data - in real app this would fetch from batch management API
      const mockBatches: Batch[] = [
        {
          id: 1,
          name: "Atlantic Batch 2024-001",
          species: "Atlantic Salmon",
          genotype: "AquaGen",
          supplier: "Benchmark Genetics",
          currentStage: "Smolt",
          currentCount: 98500,
          averageWeight: 125.5,
          location: "Faroe Islands Site A",
          dateStarted: "2024-01-15",
          status: "active"
        },
        {
          id: 2,
          name: "Atlantic Batch 2024-002",
          species: "Atlantic Salmon",
          genotype: "SalmoBreed",
          supplier: "AquaGen",
          currentStage: "Adult",
          currentCount: 85200,
          averageWeight: 2850.0,
          location: "Scotland Site B",
          dateStarted: "2023-08-20",
          status: "active"
        },
        {
          id: 3,
          name: "Atlantic Batch 2023-045",
          species: "Atlantic Salmon",
          genotype: "Landcatch",
          supplier: "Landcatch Natural Selection",
          currentStage: "Parr",
          currentCount: 125000,
          averageWeight: 45.2,
          location: "Norway Site C",
          dateStarted: "2023-12-05",
          status: "active"
        },
        {
          id: 4,
          name: "Atlantic Batch 2024-003",
          species: "Atlantic Salmon",
          genotype: "Benchmark",
          supplier: "Benchmark Genetics",
          currentStage: "Fry",
          currentCount: 150000,
          averageWeight: 2.1,
          location: "Faroe Islands Hatchery",
          dateStarted: "2024-03-10",
          status: "active"
        },
        {
          id: 5,
          name: "Atlantic Batch 2023-040",
          species: "Atlantic Salmon",
          genotype: "AquaGen",
          supplier: "AquaGen",
          currentStage: "Harvest Ready",
          currentCount: 78000,
          averageWeight: 4200.0,
          location: "Scotland Site A",
          dateStarted: "2023-06-15",
          status: "harvest_ready"
        }
      ];

      return mockBatches.filter(batch => {
        const matchesSearch = !searchTerm || 
          batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          batch.genotype.toLowerCase().includes(searchTerm.toLowerCase()) ||
          batch.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      });
    },
    enabled: open,
  });

  const handleBatchSelect = (batch: Batch) => {
    setSelectedBatch(batch);
  };

  const handleConfirmSelection = () => {
    if (selectedBatch && onBatchSelected) {
      onBatchSelected(selectedBatch);
      setOpen(false);
      setSelectedBatch(null);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'fry': return 'bg-blue-100 text-blue-800';
      case 'parr': return 'bg-green-100 text-green-800';
      case 'smolt': return 'bg-yellow-100 text-yellow-800';
      case 'adult': return 'bg-purple-100 text-purple-800';
      case 'harvest ready': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'harvest_ready': return 'secondary';
      case 'completed': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Fish className="h-5 w-5" />
            Select Batch for Scenario
          </DialogTitle>
          <DialogDescription>
            Choose an existing batch to use its current parameters as initial conditions for your scenario.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search batches by name, genotype, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="harvest_ready">Harvest Ready</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Batch List */}
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="h-8 bg-muted rounded"></div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : batches && batches.length > 0 ? (
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {batches.map((batch) => (
                <Card 
                  key={batch.id} 
                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    selectedBatch?.id === batch.id ? 'ring-2 ring-primary bg-accent' : ''
                  }`}
                  onClick={() => handleBatchSelect(batch)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{batch.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(batch.currentStage)}`}>
                            {batch.currentStage}
                          </span>
                          <Badge variant={getStatusColor(batch.status)}>
                            {batch.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{batch.location}</p>
                        <p>Started {format(new Date(batch.dateStarted), "MMM dd, yyyy")}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Count</p>
                          <p className="font-medium">{batch.currentCount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Avg Weight</p>
                          <p className="font-medium">{batch.averageWeight}g</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Genotype</p>
                        <p className="font-medium">{batch.genotype}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Supplier</p>
                        <p className="font-medium">{batch.supplier}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Fish className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No batches found</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm || statusFilter !== 'all' 
                    ? "Try adjusting your search or filter criteria"
                    : "No active batches are available for scenario creation"
                  }
                </p>
              </CardContent>
            </Card>
          )}

          {/* Selected Batch Summary */}
          {selectedBatch && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-base">Selected Batch: {selectedBatch.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Initial Count</p>
                    <p className="font-medium">{selectedBatch.currentCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Initial Weight</p>
                    <p className="font-medium">{selectedBatch.averageWeight}g</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Genotype</p>
                    <p className="font-medium">{selectedBatch.genotype}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Supplier</p>
                    <p className="font-medium">{selectedBatch.supplier}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  These values will be used as initial conditions for your new scenario.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSelection} 
              disabled={!selectedBatch}
            >
              Use Selected Batch
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
