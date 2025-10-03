/**
 * Lifecycle Stage Helper Utilities
 * Functions for managing salmon lifecycle stages and progress calculations
 */

export interface LifecycleStage {
  name: string;
  duration: number;
  color: string;
}

/**
 * Get standard salmon lifecycle stages with typical durations
 * Durations are in days and represent typical progression
 * @returns Array of lifecycle stages
 */
export function getLifecycleStages(): LifecycleStage[] {
  return [
    { name: "Egg", duration: 100, color: "bg-yellow-400" },
    { name: "Fry", duration: 100, color: "bg-orange-400" },
    { name: "Parr", duration: 100, color: "bg-green-400" },
    { name: "Smolt", duration: 100, color: "bg-blue-400" },
    { name: "Post-Smolt", duration: 100, color: "bg-purple-400" },
    { name: "Adult", duration: 450, color: "bg-red-400" }
  ];
}

/**
 * Calculate progress percentage within current lifecycle stage
 * @param stageName - Current lifecycle stage name
 * @param daysActive - Total days since batch started
 * @returns Progress percentage (0-100) within current stage
 */
export function getStageProgress(stageName?: string, daysActive?: number): number {
  if (!stageName || !daysActive) return 0;

  const stages = getLifecycleStages();
  const currentStageIndex = stages.findIndex(s => 
    stageName.toLowerCase().includes(s.name.toLowerCase())
  );

  if (currentStageIndex === -1) return 0;

  // Calculate cumulative days up to current stage
  const cumulativeDays = stages
    .slice(0, currentStageIndex)
    .reduce((sum, stage) => sum + stage.duration, 0);
  
  const daysInCurrentStage = daysActive - cumulativeDays;
  const currentStageDuration = stages[currentStageIndex].duration;

  // Ensure progress is within 0-100%
  const progress = Math.min(
    (daysInCurrentStage / currentStageDuration) * 100,
    100
  );
  
  return Math.max(0, progress);
}

/**
 * Get Tailwind CSS class for progress bar color based on completion percentage
 * @param progress - Progress percentage (0-100)
 * @returns Tailwind CSS background color class
 */
export function getProgressColor(progress: number): string {
  if (progress < 60) return "bg-green-500";
  if (progress < 75) return "bg-yellow-500";
  if (progress < 90) return "bg-orange-500";
  return "bg-red-700";
}

