import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function PenManagementTable() {
  const [selectedFarmSite] = useState(1); // Default to first farm site
  
  const { data: pens, isLoading, error } = useQuery({
    queryKey: ["/api/farm-sites", selectedFarmSite, "pens"],
    queryFn: () => api.getPensByFarmSite(selectedFarmSite),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Pen Management</h3>
            <Button>
              <i className="fas fa-plus mr-2"></i>Add New Pen
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pen Management</h3>
        <div className="text-red-600 text-center py-8">
          Failed to load pen data. Please try refreshing the page.
        </div>
      </div>
    );
  }

  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "bg-green-500";
      case "monitor":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getLastFedText = (lastFed: string | null) => {
    if (!lastFed) return "Never";
    
    const now = new Date();
    const fed = new Date(lastFed);
    const diffHours = Math.floor((now.getTime() - fed.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "< 1 hour ago";
    if (diffHours === 1) return "1 hour ago";
    return `${diffHours} hours ago`;
  };

  // Mock pen data if none returned from API
  const mockPens = [
    {
      id: 1,
      penId: "PEN-A1",
      fishCount: 2140,
      biomass: "6.8",
      healthStatus: "healthy",
      lastFed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      penId: "PEN-A2",
      fishCount: 1890,
      biomass: "5.9",
      healthStatus: "healthy",
      lastFed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      penId: "PEN-A3",
      fishCount: 2050,
      biomass: "6.2",
      healthStatus: "monitor",
      lastFed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      penId: "PEN-B1",
      fishCount: 2200,
      biomass: "7.1",
      healthStatus: "healthy",
      lastFed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 5,
      penId: "PEN-B2",
      fishCount: 1950,
      biomass: "6.0",
      healthStatus: "critical",
      lastFed: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const displayPens = pens && pens.length > 0 ? pens : mockPens;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Pen Management</h3>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <i className="fas fa-plus mr-2"></i>Add New Pen
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pen ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fish Count
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Biomass
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Health Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Fed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayPens.map((pen: any) => (
              <tr key={pen.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {pen.penId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {pen.fishCount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {pen.biomass} tons
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "px-2 py-1 text-white text-xs rounded-full capitalize",
                    getHealthStatusColor(pen.healthStatus)
                  )}>
                    {pen.healthStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getLastFedText(pen.lastFed)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-700 mr-3">
                    View
                  </button>
                  <button className="text-green-600 hover:text-green-700 mr-3">
                    Feed
                  </button>
                  <button className="text-orange-600 hover:text-orange-700">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
