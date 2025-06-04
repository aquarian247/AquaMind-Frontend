import { useFarmSites } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function FarmSitesStatus() {
  const { data: farmSites, isLoading, error } = useFarmSites();

  if (isLoading) {
    return (
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Farm Sites Status</h3>
          <button className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Farm Sites Status</h3>
        </div>
        <div className="text-red-600 text-center py-8">
          Failed to load farm sites data
        </div>
      </div>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "optimal":
        return {
          color: "bg-green-500",
          text: "Optimal",
          textColor: "text-green-600",
        };
      case "attention":
        return {
          color: "bg-orange-500",
          text: "Attention",
          textColor: "text-orange-600",
        };
      case "critical":
        return {
          color: "bg-red-500",
          text: "Critical",
          textColor: "text-red-600",
        };
      default:
        return {
          color: "bg-gray-500",
          text: "Unknown",
          textColor: "text-gray-600",
        };
    }
  };

  const getLastUpdated = (lastUpdate: string) => {
    const now = new Date();
    const updated = new Date(lastUpdate);
    const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return "Updated just now";
    if (diffMinutes < 60) return `Updated ${diffMinutes} min ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    return `Updated ${diffHours} hr ago`;
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Farm Sites Status</h3>
        <button className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {farmSites?.map((site: any) => {
          const statusInfo = getStatusInfo(site.healthStatus);
          
          return (
            <div key={site.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-warehouse text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{site.name}</h4>
                  <p className="text-sm text-gray-600">{site.location}</p>
                  <p className="text-xs text-gray-500 font-mono">
                    Fish: {site.currentStock.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className={cn("status-indicator", statusInfo.color)}></span>
                    <span className={cn("text-sm font-medium", statusInfo.textColor)}>
                      {statusInfo.text}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getLastUpdated(site.lastUpdate)}
                  </p>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
