import { useActiveAlerts } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function RecentAlerts() {
  const { data: alerts, isLoading, error } = useActiveAlerts();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Alerts</h3>
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Alerts</h3>
        </div>
        <div className="text-red-600 text-center py-8">
          Failed to load alerts data
        </div>
      </div>
    );
  }

  const getAlertStyle = (severity: string) => {
    switch (severity) {
      case "high":
      case "critical":
        return {
          bgColor: "bg-red-50",
          iconBg: "bg-red-500",
          icon: "fas fa-exclamation",
        };
      case "medium":
        return {
          bgColor: "bg-orange-50",
          iconBg: "bg-orange-500",
          icon: "fas fa-clock",
        };
      case "low":
        return {
          bgColor: "bg-blue-50",
          iconBg: "bg-blue-500",
          icon: "fas fa-info",
        };
      default:
        return {
          bgColor: "bg-gray-50",
          iconBg: "bg-gray-500",
          icon: "fas fa-info",
        };
    }
  };

  const getTimeAgo = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Recent Alerts</h3>
        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
          {alerts?.length || 0}
        </span>
      </div>
      
      <div className="space-y-4">
        {alerts?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
            <p>No active alerts</p>
          </div>
        ) : (
          alerts?.map((alert: any) => {
            const alertStyle = getAlertStyle(alert.severity);
            
            return (
              <div key={alert.id} className={cn("alert-card", alertStyle.bgColor)}>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", alertStyle.iconBg)}>
                  <i className={cn(alertStyle.icon, "text-white text-sm")}></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {getTimeAgo(alert.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {alerts && alerts.length > 0 && (
        <button className="w-full mt-4 text-center text-blue-600 hover:bg-blue-50 py-2 rounded-lg text-sm font-medium">
          View All Alerts
        </button>
      )}
    </div>
  );
}
