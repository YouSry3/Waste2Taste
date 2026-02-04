import { Target } from "lucide-react";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

type MonthlyGoal = {
  name: string;
  current: number;
  target: number;
  percentage: number;
};

interface MonthlyGoalsCardProps {
  goals: MonthlyGoal[];
  onSetGoal: () => void;
}

export function MonthlyGoalsCard({ goals, onSetGoal }: MonthlyGoalsCardProps) {
  return (
    <Card className="border-emerald-200 bg-emerald-50/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-emerald-900">Monthly Goals</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onSetGoal}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <Target className="h-4 w-4 mr-2" />
            Set Monthly Goal
          </Button>
        </div>
        <p className="text-sm text-emerald-600">Track your progress</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <div
              key={goal.name}
              className="p-4 bg-white rounded-lg border border-emerald-200"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm">{goal.name}</p>
                <span
                  className={`text-xs font-medium ${
                    goal.percentage >= 100 ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {goal.percentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all ${
                    goal.percentage >= 100 ? "bg-green-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-600">
                {goal.current % 1 !== 0
                  ? `$${goal.current.toFixed(2)}`
                  : goal.current}{" "}
                / {goal.target}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
