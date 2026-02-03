import { Check, RefreshCw } from "lucide-react";
import { Button } from "../../../ui/button";

interface ActionsPanelProps {
  isSubmitting: boolean;
  onSubmit: (event?: React.SyntheticEvent) => void;
  onCancel: () => void;
}

export function ActionsPanel({
  isSubmitting,
  onSubmit,
  onCancel,
}: ActionsPanelProps) {
  return (
    <div className="space-y-3 sticky top-6">
      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Creating Listing...
          </>
        ) : (
          <>
            <Check className="h-4 w-4 mr-2" />
            Publish Listing
          </>
        )}
      </Button>
      <Button
        variant="outline"
        className="w-full h-12 text-base font-medium border-2 hover:bg-gray-100"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
    </div>
  );
}
