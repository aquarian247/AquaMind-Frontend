import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Scale,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export type ConfidenceLevel = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | string;

export interface FCRSummaryData {
  currentFCR: number | null;
  confidenceLevel: ConfidenceLevel;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
  comparisonPeriod: string;
  predictedFCR?: number | null;
  deviation?: number | null;
  scenariosUsed?: number;
}

interface FCRSummaryCardProps {
  data: FCRSummaryData;
  className?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const confidenceConfig = {
  VERY_HIGH: {
    color: '#22c55e',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    label: 'Very High',
    icon: CheckCircle,
    description: 'Based on recent weighing data'
  },
  HIGH: {
    color: '#3b82f6',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    label: 'High',
    icon: CheckCircle,
    description: 'Within 20 days of weighing'
  },
  MEDIUM: {
    color: '#f59e0b',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
    label: 'Medium',
    icon: AlertTriangle,
    description: '20-40 days since weighing'
  },
  LOW: {
    color: '#ef4444',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    label: 'Low',
    icon: AlertTriangle,
    description: 'Over 40 days since weighing'
  }
};

// Helper function to get confidence config with fallback
const getConfidenceConfig = (level: ConfidenceLevel) => {
  const normalizedLevel = level.toUpperCase().replace(/\s+/g, '_');
  return confidenceConfig[normalizedLevel as keyof typeof confidenceConfig] || confidenceConfig.LOW;
};

export function FCRSummaryCard({
  data,
  className,
  onRefresh,
  isLoading = false
}: FCRSummaryCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();

  const config = getConfidenceConfig(data.confidenceLevel);
  const IconComponent = config.icon;

  const handleRefresh = async () => {
    if (!onRefresh) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case 'up':
        return 'text-red-600';
      case 'down':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className={cn(
        "flex items-center justify-between space-y-0 pb-2",
        isMobile ? "flex-col space-y-2" : "flex-row"
      )}>
        <CardTitle className={cn(
          "font-medium flex items-center gap-2",
          isMobile ? "text-sm" : "text-sm"
        )}>
          <Scale className="h-4 w-4 text-purple-600" />
          Feed Conversion Ratio
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="h-6 w-6 p-0 ml-2"
            >
              <RefreshCw className={cn(
                "h-3 w-3",
                (isLoading || isRefreshing) && "animate-spin"
              )} />
            </Button>
          )}
        </CardTitle>
        <div className={cn(
          "flex items-center gap-2",
          isMobile && "flex-col gap-1"
        )}>
          {getTrendIcon()}
          <Badge className={cn(
            config.bgColor,
            config.borderColor,
            config.textColor,
            "text-xs border"
          )}>
            <IconComponent className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Current FCR Value */}
          <div className={cn(
            "flex items-center justify-between",
            isMobile && "flex-col space-y-2"
          )}>
            <div>
              <div className={cn(
                "font-bold",
                isMobile ? "text-xl" : "text-2xl"
              )}>
                {data.currentFCR !== null
                  ? data.currentFCR.toFixed(2)
                  : 'N/A'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Current FCR value
              </p>
            </div>
            {data.predictedFCR !== null && data.currentFCR !== null && (
              <div className={cn(
                "text-right",
                isMobile && "text-left"
              )}>
                <div className={cn(
                  "text-sm font-medium",
                  data.deviation !== null && data.deviation !== undefined && data.deviation > 0.1
                    ? "text-red-600"
                    : data.deviation !== null && data.deviation !== undefined && data.deviation < -0.1
                    ? "text-green-600"
                    : "text-gray-600"
                )}>
                  {data.deviation !== null && data.deviation !== undefined
                    ? `${data.deviation > 0 ? '+' : ''}${data.deviation.toFixed(2)}`
                    : '0.00'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  vs Predicted
                </p>
              </div>
            )}
          </div>

          {/* Confidence Level Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Data Confidence</span>
              <span className="font-medium">{config.label}</span>
            </div>
            <div className="space-y-1">
              <Progress
                value={data.confidenceLevel === 'VERY_HIGH' ? 100 :
                       data.confidenceLevel === 'HIGH' ? 75 :
                       data.confidenceLevel === 'MEDIUM' ? 50 : 25}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {config.description}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Updated {data.lastUpdated.toLocaleDateString()}
            </div>
            {data.scenariosUsed !== undefined && (
              <div>
                {data.scenariosUsed} scenarios used
              </div>
            )}
          </div>

          {/* Prediction Info */}
          {data.predictedFCR !== null && data.predictedFCR !== undefined && (
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              <div className="flex justify-between">
                <span>Predicted FCR:</span>
                <span className="font-medium">{data.predictedFCR.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Period:</span>
                <span className="font-medium">{data.comparisonPeriod}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
