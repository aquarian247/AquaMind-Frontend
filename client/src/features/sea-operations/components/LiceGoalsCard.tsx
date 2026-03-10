import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BAKKAFROST_2025_GOALS, isSpringPeriod } from '../utils/liceThresholds';

interface LiceGoalsCardProps {
  currentMature: number | null;
  currentMovable: number | null;
}

export function LiceGoalsCard({ currentMature, currentMovable }: LiceGoalsCardProps) {
  const spring = isSpringPeriod();

  return (
    <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle>Bakkafrost 2025 Lice Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GoalItem
            label="Mature Lice Target"
            target={BAKKAFROST_2025_GOALS.mature.target}
            current={currentMature}
            unit="per fish"
          />
          <GoalItem
            label="Movable Lice Target"
            target={BAKKAFROST_2025_GOALS.movable.target}
            current={currentMovable}
            unit="per fish"
          />
          <div>
            <p className="text-sm font-medium">Spring Period (Mar-May)</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              &lt; {BAKKAFROST_2025_GOALS.spring.matureLiceMax}
            </p>
            <p className="text-xs text-muted-foreground">
              mature lice per fish {spring ? '(active now)' : '(not active)'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GoalItem({ label, target, current, unit }: {
  label: string; target: number; current: number | null; unit: string;
}) {
  const meetsGoal = current !== null && current < target;

  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">&lt; {target}</p>
      <p className="text-xs text-muted-foreground">{unit}</p>
      {current !== null && (
        <p className={`text-xs mt-1 font-medium ${meetsGoal ? 'text-green-600' : 'text-red-600'}`}>
          Current: {current.toFixed(2)} {meetsGoal ? '(on target)' : '(above target)'}
        </p>
      )}
    </div>
  );
}
