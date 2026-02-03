import { ArrowLeft } from "lucide-react";
import { Button } from "../../../ui/button";
import { PrefilledListingData } from "../types";

interface PageHeaderProps {
  prefilledData?: PrefilledListingData;
  onBack: () => void;
}

export function PageHeader({ prefilledData, onBack }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-9 w-9 p-0 hover:bg-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Listing
          </h1>
        </div>
        <p className="text-gray-600 ml-12">
          {prefilledData
            ? `Quick listing for "${prefilledData.name}"`
            : "Add a new surplus food listing to reduce waste and help customers save"}
        </p>
      </div>

      {prefilledData && (
        <div
          className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide ${
            prefilledData.status === "critical"
              ? "bg-red-100 text-red-800"
              : prefilledData.status === "low"
                ? "bg-orange-100 text-orange-800"
                : prefilledData.status === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
          }`}
        >
          {prefilledData.status || "NEW"}
        </div>
      )}
    </div>
  );
}
