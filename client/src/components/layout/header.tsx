import { useActiveAlerts } from "@/hooks/use-dashboard-data";

export default function Header() {
  const { data: alerts } = useActiveAlerts();
  const alertCount = alerts?.length || 0;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600 mt-1">Monitor your salmon farms in real-time</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
              <i className="fas fa-bell text-lg"></i>
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40" 
              alt="User avatar" 
              className="w-10 h-10 rounded-full"
            />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">John Hansen</p>
              <p className="text-xs text-gray-500">Farm Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
