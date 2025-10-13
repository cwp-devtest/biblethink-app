import { Flame } from "lucide-react";

interface ProgressHeaderProps {
  weeklyPassages: number;
  weeklyGoal: number;
  streakDays: number;
}

const ProgressHeader = ({ weeklyPassages, weeklyGoal, streakDays }: ProgressHeaderProps) => {
  const progressPercentage = Math.min((weeklyPassages / weeklyGoal) * 100, 100);

  return (
    <div className="space-y-4 mb-8">
      {/* Streak Counter */}
      <div className="flex items-center justify-center gap-2">
        <Flame className="w-5 h-5 text-accent animate-pulse-glow" />
        <span className="text-sm font-medium text-foreground">
          {streakDays} day streak
        </span>
      </div>

      {/* Weekly Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">This week's progress</span>
          <span className="font-medium text-foreground">
            {weeklyPassages}/{weeklyGoal} passages
          </span>
        </div>
        
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-success transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;
