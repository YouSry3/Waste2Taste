import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import CustomCheckbox from "./CustomCheckbox";
import { Order, orderStatusColors } from "../types/orders.types";

interface Props {
  visibleOrders: Order[];
  selectedOrderIds: string[];
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkReady: () => void;
  onBulkPickedUp: () => void;
  onBulkCancel: () => void;
}

const BulkOrderActions: React.FC<Props> = ({
  visibleOrders,
  selectedOrderIds,
  onSelectAll,
  onClearSelection,
  onBulkReady,
  onBulkPickedUp,
  onBulkCancel,
}) => {
  if (selectedOrderIds.length === 0) return null;

  const selectedOrders = visibleOrders.filter((o) =>
    selectedOrderIds.includes(o.id),
  );

  const canMarkReady = selectedOrders.some(
    (o) => o.status === "In Progress" || o.status === "Pending Pickup",
  );

  const canMarkPickedUp = selectedOrders.some(
    (o) => o.status === "Ready for Pickup",
  );

  return (
    <div className="flex items-center justify-between bg-white p-4 mb-4 border rounded-lg shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-3">
        <CustomCheckbox
          id="select-all"
          checked={selectedOrderIds.length === visibleOrders.length}
          onChange={onSelectAll}
        />
        <span className="text-sm text-gray-600">
          {selectedOrderIds.length} selected
        </span>

     
      </div>

      {/* Right */}
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={!canMarkReady}
          className="bg-blue-600 text-white disabled:opacity-40"
          onClick={onBulkReady}
        >
          Mark as Ready
        </Button>

        <Button
          size="sm"
          disabled={!canMarkPickedUp}
          className="bg-green-600 text-white disabled:opacity-40"
          onClick={onBulkPickedUp}
        >
          Mark as Picked Up
        </Button>

        <Button size="sm" className="border border-red-200 text-white bg-red-600 hover:bg-red-700" onClick={onBulkCancel}>
          Cancel
        </Button>

        <Button size="sm" className="border" onClick={onClearSelection}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default BulkOrderActions;
