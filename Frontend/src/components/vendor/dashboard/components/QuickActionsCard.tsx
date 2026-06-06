import { ChevronRight, Plus, Printer, ShoppingBag, TrendingUp } from "lucide-react";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

interface QuickActionsCardProps {
  onCreateListing: () => void;
  onViewAllOrders: () => void;
  onViewAnalytics: () => void;
  onPrintPickupList: () => void;
}

export function QuickActionsCard({
  onCreateListing,
  onViewAllOrders,
  onViewAnalytics,
  onPrintPickupList,
}: QuickActionsCardProps) {
  const actions = [
    {
      label: "Create New Listing",
      description: "Add surplus items",
      icon: Plus,
      onClick: onCreateListing,
      iconClassName: "bg-blue-100 text-blue-600",
      hoverClassName: "hover:bg-blue-50 hover:border-blue-200",
    },
    {
      label: "Manage Orders",
      description: "View all orders",
      icon: ShoppingBag,
      onClick: onViewAllOrders,
      iconClassName: "bg-purple-100 text-purple-600",
      hoverClassName: "hover:bg-purple-50 hover:border-purple-200",
    },
    {
      label: "View Analytics",
      description: "Performance insights",
      icon: TrendingUp,
      onClick: onViewAnalytics,
      iconClassName: "bg-green-100 text-green-600",
      hoverClassName: "hover:bg-green-50 hover:border-green-200",
    },
    {
      label: "Print Pickup List",
      description: "Today's schedule",
      icon: Printer,
      onClick: onPrintPickupList,
      iconClassName: "bg-gray-100 text-gray-600",
      hoverClassName: "hover:bg-gray-100 hover:border-gray-300",
    },
  ];

  return (
    <Card className="flex-1 pb-10 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle>Quick Actions</CardTitle>
        <p className="text-sm text-gray-500">Frequently used tasks</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Button
                key={action.label}
                className={`h-16  w-full justify-start px-3 py-2 transition-colors ${action.hoverClassName}`}
                variant="outline"
                onClick={action.onClick}
              >
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md ${action.iconClassName}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block truncate text-sm font-medium text-gray-900">
                      {action.label}
                    </span>
                    <span className="block truncate text-xs font-normal text-gray-500">
                      {action.description}
                    </span>
                  </span>
                </span>
                <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0 text-gray-400" />
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
