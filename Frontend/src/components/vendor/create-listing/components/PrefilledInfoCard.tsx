import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { PrefilledListingData } from "../types";

interface PrefilledInfoCardProps {
  prefilledData: PrefilledListingData;
}

export function PrefilledInfoCard({ prefilledData }: PrefilledInfoCardProps) {
  return (
    <Card className="shadow-sm border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-blue-900">
          Auto-filled Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-blue-200">
          <span className="text-xs text-blue-700 font-medium">Item:</span>
          <span className="text-sm font-semibold text-blue-900">
            {prefilledData.name}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-blue-200">
          <span className="text-xs text-blue-700 font-medium">Stock:</span>
          <span className="text-sm font-semibold text-blue-900">
            {prefilledData.stock} available
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-blue-200">
          <span className="text-xs text-blue-700 font-medium">Expires:</span>
          <span className="text-sm font-semibold text-blue-900">
            {prefilledData.expiry}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-xs text-blue-700 font-medium">Urgency:</span>
          <span
            className={`text-sm font-bold uppercase ${
              prefilledData.status === "critical"
                ? "text-red-600"
                : prefilledData.status === "low"
                  ? "text-orange-600"
                  : prefilledData.status === "medium"
                    ? "text-yellow-600"
                    : "text-green-600"
            }`}
          >
            {prefilledData.status}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
