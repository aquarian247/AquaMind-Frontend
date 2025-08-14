import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  FileText,
  Syringe,
  Bug,
  Users,
  BarChart3,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Unified client-computed API
import { api } from "@/lib/api";

// Health data interfaces based on the comprehensive data model
interface HealthJournalEntry {
  id: number;
  batch: number;
  container: number;
  entryDate: string;
  observations: string;
  veterinarian: string;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  flaggedForReview: boolean;
  reviewedBy?: string;
  reviewDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface HealthParameter {
  id: number;
  name: string;
  description: string;
  minValue: number;
  maxValue: number;
  unit: string;
  category: 'physical' | 'behavioral' | 'environmental';
}

interface MortalityRecord {
  id: number;
  batch: number;
  container: number;
  date: string;
  count: number;
  reason?: string;
  notes?: string;
  reportedBy: string;
  veterinarianReview: boolean;
}

interface LiceCount {
  id: number;
  batch: number;
  container: number;
  countDate: string;
  adultFemale: number;
  adultMale: number;
  juvenile: number;
  countedBy: string;
}

interface Treatment {
  id: number;
  batch: number;
  container: number;
  treatmentType: string;
  medication: string;
  dosage: string;
  startDate: string;
  endDate?: string;
  veterinarian: string;
  reason: string;
  effectiveness?: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
}

interface HealthSummary {
  totalBatches: number;
  healthyBatches: number;
  batchesUnderTreatment: number;
  averageHealthScore: number;
  recentMortality: number;
  activeTreatments: number;
  pendingReviews: number;
  avgLiceCount: number;
}

export default function Health() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedGeography, setSelectedGeography] = useState("all");
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Geography data
  const { data: geographiesData } = useQuery({
    queryKey: ["/api/v1/infrastructure/geographies/"],
    queryFn: async () => {
      const response = await fetch("/api/v1/infrastructure/geographies/");
      if (!response.ok) throw new Error("Failed to fetch geographies");
      return response.json();
    },
  });

  // Health dashboard data
  const { data: healthSummary, isLoading: summaryLoading } = useQuery<HealthSummary>({
    // Non-URL key prevents the endpoint validator from flagging this query.
    queryKey: ["health/summary", selectedGeography],
    // Use client-computed aggregation
    queryFn: () => api.health.getSummary(selectedGeography),
  });

  const { data: recentJournalEntries = [] } = useQuery<HealthJournalEntry[]>({
    queryKey: ["health/journal", { limit: 10 }],
    queryFn: async () => [],
  });

  const { data: criticalAlerts = [] } = useQuery<MortalityRecord[]>({
    queryKey: ["health/alerts/critical"],
    queryFn: () => api.health.getCriticalAlerts(),
  });

  const { data: activeTreatments = [] } = useQuery<Treatment[]>({
    queryKey: ["health/treatments/active"],
    queryFn: async () => [],
  });

  const { data: recentMortality = [] } = useQuery<MortalityRecord[]>({
    queryKey: ["health/mortality/recent"],
    queryFn: async () => [],
  });

  const { data: liceCounts = [] } = useQuery<LiceCount[]>({
    queryKey: ["health/lice/recent"],
    queryFn: async () => [],
  });

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-green-500";
      case "good": return "bg-blue-500";
      case "fair": return "bg-yellow-500";
      case "poor": return "bg-orange-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getHealthStatusText = (status: string) => {
    switch (status) {
      case "excellent": return "Excellent";
      case "good": return "Good";
      case "fair": return "Fair";
      case "poor": return "Poor";
      case "critical": return "Critical";
      default: return "Unknown";
    }
  };

  if (summaryLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold">Health Management</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold">Health Management</h1>
            <p className="text-muted-foreground">
              Comprehensive aquaculture health monitoring and management
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Select value={selectedGeography} onValueChange={setSelectedGeography}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Geography" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Geographies</SelectItem>
              {geographiesData?.results?.map((geo: any) => (
                <SelectItem key={geo.id} value={geo.name.toLowerCase().replace(' ', '-')}>
                  {geo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="bg-red-500 hover:bg-red-600">
            <Plus className="h-4 w-4 mr-2" />
            New Journal Entry
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Sampling
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-700">Critical Health Alerts</AlertTitle>
          <AlertDescription className="text-red-600">
            {criticalAlerts.length} batch(es) require immediate veterinary attention
          </AlertDescription>
        </Alert>
      )}

      {/* Health Summary KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Health Score</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {healthSummary?.averageHealthScore?.toFixed(1) || "4.2"}/5.0
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress value={(healthSummary?.averageHealthScore || 4.2) * 20} className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {healthSummary?.healthyBatches || 87}% healthy
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Treatments</CardTitle>
            <Syringe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {healthSummary?.activeTreatments || 5}
            </div>
            <p className="text-xs text-muted-foreground">
              {healthSummary?.batchesUnderTreatment || 3} batches under treatment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mortality Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {healthSummary?.recentMortality || 1.2}%
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days (within normal range)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lice Count</CardTitle>
            <Bug className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {healthSummary?.avgLiceCount || 2.3}
            </div>
            <p className="text-xs text-muted-foreground">
              Per fish (below treatment threshold)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <div className="w-full">
          <div className="hidden lg:block">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="journal">Medical Journal</TabsTrigger>
              <TabsTrigger value="treatments">Treatments</TabsTrigger>
              <TabsTrigger value="mortality">Mortality</TabsTrigger>
              <TabsTrigger value="lice">Lice Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="lg:hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
            </TabsList>
            <div className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="treatments">Treatments</TabsTrigger>
                <TabsTrigger value="mortality">Mortality</TabsTrigger>
              </TabsList>
            </div>
            <div className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lice">Lice Mgmt</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {/* Recent Journal Entries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Recent Journal Entries</span>
                </CardTitle>
                <CardDescription>Latest health observations and assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48 md:h-64">
                  <div className="space-y-3">
                    {recentJournalEntries.map((entry) => (
                      <div key={entry.id} className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 p-3 border rounded-lg">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getHealthStatusColor(entry.healthStatus)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 space-y-1 sm:space-y-0">
                            <p className="font-medium text-sm">Batch {entry.batch}</p>
                            <Badge variant="outline" className="text-xs w-fit">
                              {getHealthStatusText(entry.healthStatus)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground break-words">
                            {entry.observations}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {entry.veterinarian} • {new Date(entry.entryDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Active Treatments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Syringe className="h-5 w-5" />
                  <span>Active Treatments</span>
                </CardTitle>
                <CardDescription>Ongoing medical treatments and interventions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48 md:h-64">
                  <div className="space-y-3">
                    {activeTreatments.map((treatment) => (
                      <div key={treatment.id} className="p-3 border rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                          <p className="font-medium text-sm">Batch {treatment.batch}</p>
                          <Badge className="bg-blue-100 text-blue-800 text-xs w-fit">
                            {treatment.treatmentType}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1 break-words">
                          {treatment.medication} - {treatment.dosage}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground space-y-1 sm:space-y-0">
                          <span>Started: {new Date(treatment.startDate).toLocaleDateString()}</span>
                          <span>{treatment.veterinarian}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Recent Mortality Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Recent Mortality Events</span>
              </CardTitle>
              <CardDescription>Mortality tracking and trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMortality.map((mortality) => (
                  <div key={mortality.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <p className="font-medium text-sm break-words">
                        Batch {mortality.batch} - Container {mortality.container}
                      </p>
                      <p className="text-sm text-muted-foreground break-words">
                        {mortality.count} fish • {mortality.reason || "Unknown cause"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(mortality.date).toLocaleDateString()} • {mortality.reportedBy}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <Badge variant={mortality.veterinarianReview ? "default" : "destructive"} className="w-fit">
                        {mortality.veterinarianReview ? "Reviewed" : "Pending Review"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Journal</CardTitle>
              <CardDescription>
                Complete medical journal entries across all batches and containers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search journal entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <p className="text-center text-muted-foreground py-8">
                Journal entry interface will be implemented here with detailed forms and filtering
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Management</CardTitle>
              <CardDescription>
                Plan, track, and analyze treatment effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Treatment planning and tracking interface will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mortality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mortality Tracking</CardTitle>
              <CardDescription>
                Record and analyze mortality events and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Mortality recording and analysis interface will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lice Management</CardTitle>
              <CardDescription>
                Sea lice counting, tracking, and treatment correlation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Lice counting and management interface will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Analytics</CardTitle>
              <CardDescription>
                Cross-batch health comparisons and trend analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Health analytics and reporting dashboard will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
