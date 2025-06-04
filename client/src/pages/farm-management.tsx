import { Card, CardContent } from "@/components/ui/card";
import PenManagementTable from "@/components/farm/pen-management-table";

export default function FarmManagement() {
  const farmOverview = [
    { id: 1, label: "Active Pens", value: "24", unit: "operational", icon: "fas fa-warehouse" },
    { id: 2, label: "Total Capacity", value: "50K", unit: "fish", icon: "fas fa-fish" },
    { id: 3, label: "Current Stock", value: "42.3K", unit: "fish (84.6%)", icon: "fas fa-chart-pie" },
    { id: 4, label: "Harvest Ready", value: "2.34K", unit: "fish", icon: "fas fa-truck" },
  ];

  return (
    <div className="space-y-6">
      {/* Farm Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {farmOverview.map((item) => (
          <Card key={item.id} className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{item.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.unit}</p>
                </div>
                <i className={`${item.icon} text-2xl text-blue-600`}></i>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pen Management Table */}
      <PenManagementTable />
    </div>
  );
}
