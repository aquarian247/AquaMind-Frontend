/**
 * Area Maintenance Tab Component
 * 
 * Displays maintenance schedule and history.
 * 
 * @module features/infrastructure/components/AreaMaintenanceTab
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

/**
 * Maintenance schedule and history tab
 */
export function AreaMaintenanceTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Maintenance Schedule</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Net inspection</span>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Mooring check</span>
              <Badge variant="outline">Due in 3 days</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Anchor inspection</span>
              <Badge variant="outline">Due in 1 week</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Equipment calibration</span>
              <Badge variant="outline">Due in 2 weeks</Badge>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" size="sm">
            Schedule Maintenance
          </Button>
          <Button variant="outline" size="sm">
            View History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

