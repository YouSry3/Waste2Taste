import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

export function TipsCard() {
  return (
    <Card className="shadow-sm bg-gradient-to-br from-green-50 to-green-100/50 border-green-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-green-900 font-semibold">
          <Info className="h-4 w-4" />
          ðŸ’¡ Tips for Success
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5 text-xs text-green-800">
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">âœ“</span>
            <span>
              Use <strong>clear, appetizing photos</strong> to attract customers
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">âœ“</span>
            <span>
              Be <strong>specific about contents</strong> and quantity
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">âœ“</span>
            <span>
              Set <strong>realistic pickup windows</strong> (2-3 hours)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">âœ“</span>
            <span>
              Price <strong>50-70% off</strong> retail value
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">âœ“</span>
            <span>
              Update quantity in <strong>real-time</strong> as bags sell
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
