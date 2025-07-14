import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Thermometer, Droplets, Activity, Filter, Grid, List, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

function BroodstockPopulation() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: containers, isLoading } = useQuery<{ count: number; results: any[] }>({
    queryKey: ['/api/v1/broodstock/containers/'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return <Activity className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-3 lg:p-6">
        <div className="space-y-4">
          <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-48 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/broodstock">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Population Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor broodstock containers and environmental conditions
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4 mr-2" />
            Grid
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Containers
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {containers?.count || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Optimal Status
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.floor((containers?.results?.filter((c: any) => c.environmentalStatus === 'optimal').length || 0) / (containers?.count || 1) * 100)}%
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Temperature
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {containers?.results ? 
                    (containers.results.reduce((sum: number, c: any) => sum + parseFloat(c.temperature), 0) / containers.results.length).toFixed(1) 
                    : '0.0'}°C
                </p>
              </div>
              <Thermometer className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Fish
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {containers?.results?.reduce((sum: number, c: any) => sum + c.fishCount, 0)?.toLocaleString() || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Container Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {containers?.results?.map((container: any) => (
            <Card key={container.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base leading-tight">
                      {container.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {container.location || 'Location not specified'}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(container.environmentalStatus)}>
                    {getStatusIcon(container.environmentalStatus)}
                    <span className="ml-1 text-xs">{container.environmentalStatus}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Fish Count */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fish Count</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {container.fishCount} / {container.capacity}
                  </span>
                </div>

                {/* Environmental Metrics */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-600 dark:text-gray-400">Temp</span>
                    <span className="font-medium">{container.temperature}°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">O₂</span>
                    <span className="font-medium">{container.oxygen} mg/L</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-600 dark:text-gray-400">pH</span>
                    <span className="font-medium">{container.ph}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 bg-yellow-400 rounded-full"></span>
                    <span className="text-gray-600 dark:text-gray-400">Light</span>
                    <span className="font-medium">{container.light}h</span>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Capacity</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {Math.round((container.fishCount / container.capacity) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((container.fishCount / container.capacity) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Container List View</CardTitle>
            <CardDescription>
              Detailed container information in tabular format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Container</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Fish Count</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Capacity</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Temperature</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Oxygen</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">pH</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {containers?.results?.map((container: any) => (
                    <tr key={container.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{container.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{container.location}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2 font-semibold text-gray-900 dark:text-gray-100">
                        {container.fishCount}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          <span>{container.capacity}</span>
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                            <div 
                              className="bg-blue-600 h-1 rounded-full" 
                              style={{ width: `${Math.min((container.fishCount / container.capacity) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">{container.temperature}°C</td>
                      <td className="py-3 px-2">{container.oxygen} mg/L</td>
                      <td className="py-3 px-2">{container.ph}</td>
                      <td className="py-3 px-2">
                        <Badge className={getStatusColor(container.environmentalStatus)}>
                          {container.environmentalStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Environmental Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
            Environmental Alerts
          </CardTitle>
          <CardDescription>
            Current environmental conditions requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {containers?.results
              ?.filter((c: any) => c.environmentalStatus !== 'optimal')
              ?.slice(0, 5)
              ?.map((container: any) => (
                <div key={container.id} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {container.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Temperature: {container.temperature}°C, Oxygen: {container.oxygen} mg/L
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(container.environmentalStatus)}>
                    {container.environmentalStatus}
                  </Badge>
                </div>
              ))}
            {!containers?.results?.some((c: any) => c.environmentalStatus !== 'optimal') && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>All containers are operating within optimal parameters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BroodstockPopulation;