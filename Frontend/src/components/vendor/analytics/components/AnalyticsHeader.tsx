import { Download } from "lucide-react";

interface AnalyticsHeaderProps {
  timeRange: "week" | "month" | "quarter";
  onTimeRangeChange: (value: "week" | "month" | "quarter") => void;
}

export function AnalyticsHeader({
  timeRange,
  onTimeRangeChange,
}: AnalyticsHeaderProps) {
  return (
    <div className="mb-4 flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-500">
          Insights into your business performance
        </p>
      </div>

      <div className="flex gap-3">
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <button
            onClick={() => onTimeRangeChange("week")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === "week"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => onTimeRangeChange("month")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === "month"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => onTimeRangeChange("quarter")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === "quarter"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Quarter
          </button>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Export</span>
        </button>
      </div>
    </div>
  );
}
