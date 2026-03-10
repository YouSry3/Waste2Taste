import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

interface EnvironmentalImpactData {
  foodSavedLbs: number;
  co2PreventedKg: number;
  mealsProvided: number;
}

interface EnvironmentalImpactCardProps {
  data?: EnvironmentalImpactData;
}

const defaultData: EnvironmentalImpactData = {
  foodSavedLbs: 1240,
  co2PreventedKg: 620,
  mealsProvided: 1032,
};

export function EnvironmentalImpactCard({ data }: EnvironmentalImpactCardProps) {
  const impact = data ?? defaultData;

  return (
    <Card className="border-emerald-200 bg-emerald-50/30 flex-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <CardTitle className="text-emerald-900">
            Environmental Impact
          </CardTitle>
        </div>
        <p className="text-sm text-emerald-600">This month&apos;s contribution</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 h-full">
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-700">Food saved</span>
              <span className="font-bold text-emerald-800 text-lg">
                {impact.foodSavedLbs.toLocaleString()} lbs
              </span>
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-700">CO2 prevented</span>
              <span className="font-bold text-emerald-800 text-lg">
                {impact.co2PreventedKg.toLocaleString()} kg
              </span>
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-700">Meals provided</span>
              <span className="font-bold text-emerald-800 text-lg">
                {impact.mealsProvided.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-emerald-200">
            <p className="text-xs text-emerald-600 text-center">
              You are making a real difference.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
