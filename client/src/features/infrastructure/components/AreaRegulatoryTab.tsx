/**
 * Area Regulatory Tab Component
 * 
 * Displays compliance status and regulatory documentation.
 * 
 * @module features/infrastructure/components/AreaRegulatoryTab
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, FileText } from "lucide-react";

/**
 * Regulatory compliance and documentation tab
 */
export function AreaRegulatoryTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Compliance Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Environmental permit</span>
              <Badge className="bg-green-100 text-green-800">Valid</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Fish health certificate</span>
              <Badge className="bg-green-100 text-green-800">Valid</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Biomass reporting</span>
              <Badge className="bg-yellow-100 text-yellow-800">Due soon</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Documentation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Environmental Impact Assessment
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Fish Health Management Plan
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Escape Prevention Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

