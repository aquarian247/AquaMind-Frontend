import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Users, Thermometer, Eye, Grid, List, Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Container } from "@/api/generated/models/Container";

interface BroodstockPopulationProps {
  containers: Container[] | null;
  containerCount: number;
  totalFishCount: number;
  isLoading: boolean;
}

export function BroodstockPopulation({
  containers,
  containerCount,
  totalFishCount,
  isLoading
}: BroodstockPopulationProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
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

  // Calculate active containers percentage
  const activeContainers = containers?.filter(c => c.active).length || 0;
  const activePercentage = containerCount > 0 ? Math.floor((activeContainers / containerCount) * 100) : 0;

  return (
    <div className="space-y-6">
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
                  {containerCount}
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
                  Active Containers
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {activePercentage}%
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
                  N/A
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
                  {totalFishCount.toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Population Management
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor broodstock containers and environmental conditions
          </p>
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

      {/* Container Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {containers && containers.length > 0 ? (
            containers.map((container: Container) => (
              <Card key={container.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base leading-tight">
                        {container.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {container.hall_name || container.area_name || 'Location not specified'}
                      </p>
                    </div>
                    <Badge className={container.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      <Activity className="w-3 h-3 mr-1" />
                      <span className="text-xs">{container.active ? 'Active' : 'Inactive'}</span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Container Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 dark:text-gray-400">Volume</span>
                      <span className="font-medium">{container.volume_m3} m³</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 dark:text-gray-400">Max Biomass</span>
                      <span className="font-medium">{container.max_biomass_kg} kg</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link href={`/broodstock-container-details/${container.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No containers available
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Container List View</CardTitle>
            <p className="text-sm text-muted-foreground">
              Detailed container information in tabular format
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Container</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Volume (m³)</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Max Biomass (kg)</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {containers && containers.length > 0 ? (
                    containers.map((container: Container) => (
                      <tr key={container.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-2">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{container.name}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {container.hall_name || container.area_name || 'Location not specified'}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-semibold text-gray-900 dark:text-gray-100">
                          {container.volume_m3}
                        </td>
                        <td className="py-3 px-2 font-semibold text-gray-900 dark:text-gray-100">
                          {container.max_biomass_kg}
                        </td>
                        <td className="py-3 px-2">
                          <Badge className={container.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {container.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Link href={`/broodstock-container-details/${container.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No containers available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
