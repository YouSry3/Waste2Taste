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
        

        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Export</span>
        </button>
      </div>
    </div>
  );
}
