import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface Benchmark {
  metric: string;
  current: number;
  target: number;
  industry: number;
  status: 'above' | 'below' | 'on-target';
}

interface BenchmarkingTabProps {
  benchmarks: Benchmark[];
}

export function BenchmarkingTab({
  benchmarks
}: BenchmarkingTabProps) {
  const getBenchmarkStatus = (status: string) => {
    switch (status) {
      case 'above': return { icon: CheckCircle, color: "text-green-600" };
      case 'below': return { icon: AlertTriangle, color: "text-red-600" };
      default: return { icon: Target, color: "text-blue-600" };
    }
  };

  if (benchmarks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Benchmarking data not yet available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {benchmarks.map((benchmark, index) => {
        const StatusIcon = getBenchmarkStatus(benchmark.status).icon;
        const statusColor = getBenchmarkStatus(benchmark.status).color;

        return (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <StatusIcon className={cn("h-5 w-5", statusColor)} />
                  <span className="font-medium">{benchmark.metric}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <label className="text-xs text-muted-foreground">Current</label>
                    <p className="font-bold">{benchmark.current.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Target</label>
                    <p className="font-bold text-blue-600">{benchmark.target.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Industry</label>
                    <p className="font-bold text-gray-600">{benchmark.industry.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <Progress
                    value={(benchmark.current / benchmark.target) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">vs Target</p>
                </div>
                <div>
                  <Progress
                    value={(benchmark.current / benchmark.industry) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">vs Industry</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
