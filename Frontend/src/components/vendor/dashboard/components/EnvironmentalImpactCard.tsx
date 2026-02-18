import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

export function EnvironmentalImpactCard() {
  return (
    <Card className="border-emerald-200 bg-emerald-50/30 flex-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <CardTitle className="text-emerald-900">
            Environmental Impact
          </CardTitle>
        </div>
        <p className="text-sm text-emerald-600">This month's contribution</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 h-full">
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-700">Food saved</span>
              <span className="font-bold text-emerald-800 text-lg">
                1,240 lbs
              </span>
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-700">CO₂ prevented</span>
              <span className="font-bold text-emerald-800 text-lg">
                620 kg
              </span>
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-700">Meals provided</span>
              <span className="font-bold text-emerald-800 text-lg">1,032</span>
            </div>
          </div>
          <div className="pt-2 border-t border-emerald-200">
            <p className="text-xs text-emerald-600 text-center">
              You're making a real difference! 🌱
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
