import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Heart, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CalendarIcon,
  FileText,
  Thermometer,
  Droplets,
  Zap,
  Eye,
  Users
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BatchHealthViewProps {
  batchId: number;
  batchName: string;
}

interface HealthRecord {
  id: number;
  date: string;
  healthScore: number;
  mortalityCount: number;
  notes: string;
  veterinarian: string;
  assessment: {
    behavior: string;
    physicalCondition: string;
    growthRate: number;
  };
}

interface MortalityEvent {
  id: number;
  date: string;
  count: number;
  cause: string;
  description: string;
  containerName?: string;
}

interface HealthAssessment {
  id: number;
  date: string;
  veterinarian: string;
  healthScore: number;
  mortalityRate: number;
  growthRate: number;
  behavior: string;
  physicalCondition: string;
  notes: string;
}

interface LabSample {
  id: number;
  sampleDate: string;
  sampleType: string;
  labId: string;
  results: any;
  notes: string;
}

export function BatchHealthView({ batchId, batchName }: BatchHealthViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [mortalityFilter, setMortalityFilter] = useState("all");
  const isMobile = useIsMobile();

  // Fetch batch health data
  const { data: healthRecords = [] } = useQuery<HealthRecord[]>({
    queryKey: ["/api/health/records", batchId],
    queryFn: async () => {
      const response = await fetch(`/api/health/records?batchId=${batchId}`);
      if (!response.ok) throw new Error("Failed to fetch health records");
      return response.json();
    },
  });

  const { data: mortalityEvents = [] } = useQuery<MortalityEvent[]>({
    queryKey: ["/api/batch/mortality-events", batchId],
    queryFn: async () => {
      const response = await fetch(`/api/batch/mortality-events?batchId=${batchId}`);
      if (!response.ok) throw new Error("Failed to fetch mortality events");
      return response.json();
    },
  });

  const { data: healthAssessments = [] } = useQuery<HealthAssessment[]>({
    queryKey: ["/api/health/assessments", batchId],
    queryFn: async () => {
      const response = await fetch(`/api/health/assessments?batchId=${batchId}`);
      if (!response.ok) throw new Error("Failed to fetch health assessments");
      return response.json();
    },
  });

  const { data: labSamples = [] } = useQuery<LabSample[]>({
    queryKey: ["/api/health/lab-samples", batchId],
    queryFn: async () => {
      const response = await fetch(`/api/health/lab-samples?batchId=${batchId}`);
      if (!response.ok) throw new Error("Failed to fetch lab samples");
      return response.json();
    },
  });

  // Calculate health metrics
  const currentHealthScore = healthRecords.length > 0 
    ? healthRecords[healthRecords.length - 1].healthScore 
    : 0;

  const totalMortality = mortalityEvents.reduce((sum, event) => sum + event.count, 0);
  
  const recentMortality = mortalityEvents
    .filter(event => {
      const eventDate = new Date(event.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return eventDate >= sevenDaysAgo;
    })
    .reduce((sum, event) => sum + event.count, 0);

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-100 border-green-200";
    if (score >= 80) return "bg-blue-100 border-blue-200";
    if (score >= 70) return "bg-yellow-100 border-yellow-200";
    if (score >= 60) return "bg-orange-100 border-orange-200";
    return "bg-red-100 border-red-200";
  };

  const getMortalityCauseColor = (cause: string) => {
    switch (cause.toLowerCase()) {
      case "disease": return "bg-red-100 text-red-700 border-red-200";
      case "stress": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "predation": return "bg-orange-100 text-orange-700 border-orange-200";
      case "environmental": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Health Status for {batchName}
          </h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive health monitoring and mortality tracking
          </p>
        </div>
      </div>

      {/* Health Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Health Score</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", getHealthScoreColor(currentHealthScore))}>
              {currentHealthScore}/100
            </div>
            <p className="text-xs text-muted-foreground">
              Latest assessment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mortality</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMortality.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Cumulative count
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Mortality</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{recentMortality}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Assessments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthAssessments.length}</div>
            <p className="text-xs text-muted-foreground">
              Total records
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <div className="mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {activeTab === "overview" && "Health Overview"}
                  {activeTab === "mortality" && "Mortality Events"}
                  {activeTab === "assessments" && "Health Assessments"}
                  {activeTab === "lab-results" && "Lab Results"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Health Overview</SelectItem>
                <SelectItem value="mortality">Mortality Events</SelectItem>
                <SelectItem value="assessments">Health Assessments</SelectItem>
                <SelectItem value="lab-results">Lab Results</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Health Overview</TabsTrigger>
            <TabsTrigger value="mortality">Mortality Events</TabsTrigger>
            <TabsTrigger value="assessments">Health Assessments</TabsTrigger>
            <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Score Trend</CardTitle>
                <CardDescription>Health score progression over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthRecords.slice(-5).map((record, index) => (
                  <div key={record.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn("w-2 h-2 rounded-full", getHealthScoreBg(record.healthScore))}></div>
                      <span className="text-sm">{format(new Date(record.date), "MMM dd")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={cn("font-semibold", getHealthScoreColor(record.healthScore))}>
                        {record.healthScore}
                      </span>
                      {index > 0 && (
                        <div className="flex items-center">
                          {record.healthScore > healthRecords[healthRecords.length - 2 - index]?.healthScore ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Health Issues</CardTitle>
                <CardDescription>Latest health concerns and observations</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-3">
                    {healthRecords.slice(-3).map((record) => (
                      <div key={record.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{format(new Date(record.date), "MMM dd, yyyy")}</span>
                          <Badge variant="outline">{record.veterinarian}</Badge>
                        </div>
                        {record.notes && (
                          <p className="text-sm text-muted-foreground">{record.notes}</p>
                        )}
                        <Separator />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mortality" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Select value={mortalityFilter} onValueChange={setMortalityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by cause" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Causes</SelectItem>
                <SelectItem value="disease">Disease</SelectItem>
                <SelectItem value="stress">Stress</SelectItem>
                <SelectItem value="predation">Predation</SelectItem>
                <SelectItem value="environmental">Environmental</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {mortalityEvents
              .filter(event => mortalityFilter === "all" || event.cause.toLowerCase() === mortalityFilter)
              .map((event) => (
                <Card key={event.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="font-semibold">{event.count} mortalities</span>
                          <Badge className={getMortalityCauseColor(event.cause)}>
                            {event.cause}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.date), "MMM dd, yyyy")}
                          {event.containerName && ` • ${event.containerName}`}
                        </p>
                        {event.description && (
                          <p className="text-sm">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <div className="space-y-4">
            {healthAssessments.map((assessment) => (
              <Card key={assessment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Assessment - {format(new Date(assessment.date), "MMM dd, yyyy")}
                      </CardTitle>
                      <CardDescription>Veterinarian: {assessment.veterinarian}</CardDescription>
                    </div>
                    <Badge className={getHealthScoreBg(assessment.healthScore)}>
                      Score: {assessment.healthScore}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Mortality Rate</label>
                      <p className="font-semibold">{assessment.mortalityRate}%</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Growth Rate</label>
                      <p className="font-semibold text-green-600">+{assessment.growthRate}%</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Behavior</label>
                      <p className="font-semibold">{assessment.behavior}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Physical Condition</label>
                    <p className="mt-1">{assessment.physicalCondition}</p>
                  </div>
                  
                  {assessment.notes && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Notes</label>
                      <p className="mt-1 text-sm">{assessment.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lab-results" className="space-y-6">
          <div className="space-y-4">
            {labSamples.map((sample) => (
              <Card key={sample.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {sample.sampleType} Sample - {sample.labId}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(sample.sampleDate), "MMM dd, yyyy")}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{sample.sampleType}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Results</label>
                      <div className="mt-1 p-3 bg-muted rounded-md">
                        <pre className="text-sm">{JSON.stringify(sample.results, null, 2)}</pre>
                      </div>
                    </div>
                    {sample.notes && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Notes</label>
                        <p className="mt-1 text-sm">{sample.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
