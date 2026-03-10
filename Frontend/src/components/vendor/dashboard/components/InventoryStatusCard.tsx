import { AlertTriangle, CheckCircle2, Clock, Package, Plus } from "lucide-react";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

type InventoryItem = {
  id: number | string;
  name: string;
  stock: number;
  expiry: string;
  status: "critical" | "low" | "medium" | "good";
  isUrgent?: boolean;
};

interface InventoryStatusCardProps {
  items: InventoryItem[];
  onCreateListing: (item: InventoryItem) => void;
}

export function InventoryStatusCard({
  items,
  onCreateListing,
}: InventoryStatusCardProps) {
  const statusConfig = {
    critical: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: AlertTriangle,
      label: "Expires in less than 2 hours!",
    },
    low: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      icon: AlertTriangle,
      label: "Expires in less than 6 hours",
    },
    medium: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      icon: Clock,
      label: "Expires in less than 24 hours",
    },
    good: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: CheckCircle2,
      label: "Plenty of time until expiry",
    },
  };

  return (
    <Card className="border-orange-200 bg-orange-50/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-orange-900">Inventory Status</CardTitle>
        </div>
        <p className="text-sm text-orange-600">Items expiring soon</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.length === 0 && (
            <div className="rounded-lg border border-dashed border-orange-300 bg-white p-4 text-sm text-orange-700">
              No expiring products right now.
            </div>
          )}

          {items.map((item) => {
            const config = statusConfig[item.status] || statusConfig.good;
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className={`rounded-lg border p-3 ${
                  item.isUrgent
                    ? "border-red-300 bg-red-50"
                    : `${config.bg} ${config.border}`
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {item.name}
                    </p>
                    <p
                      className={`mt-1 text-xs ${
                        item.isUrgent ? "text-red-700" : config.text
                      }`}
                    >
                      Stock: {item.stock} • Time Remaining: {item.expiry}
                    </p>
                    <p
                      className={`mt-1 text-xs font-medium ${
                        item.isUrgent ? "text-red-700" : config.text
                      }`}
                    >
                      {config.label}
                    </p>
                  </div>
                  <Icon
                    className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                      item.isUrgent ? "text-red-700" : config.text
                    }`}
                  />
                </div>
                {item.status === "critical" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 text-xs border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                    onClick={() => onCreateListing(item)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Create Listing Now
                  </Button>
                )}
                {(item.status === "low" || item.status === "medium") && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 text-xs"
                    onClick={() => onCreateListing(item)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Create Listing
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
