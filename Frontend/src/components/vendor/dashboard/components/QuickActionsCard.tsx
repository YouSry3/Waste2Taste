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
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <p className="text-sm text-gray-500">Frequently used tasks</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
          <Button
            className="h-auto py-4 justify-start hover:bg-blue-50 hover:border-blue-200 transition-colors"
            variant="outline"
            onClick={onCreateListing}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Create New Listing</p>
                  <p className="text-sm text-gray-500">Add surplus items</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </Button>

          <Button
            className="h-auto py-4 justify-start hover:bg-purple-50 hover:border-purple-200 transition-colors"
            variant="outline"
            onClick={onViewAllOrders}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Manage Orders</p>
                  <p className="text-sm text-gray-500">View all orders</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </Button>

          <Button
            className="h-auto py-4 justify-start hover:bg-green-50 hover:border-green-200 transition-colors"
            variant="outline"
            onClick={onViewAnalytics}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">View Analytics</p>
                  <p className="text-sm text-gray-500">
                    Performance insights
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </Button>

          <Button
            className="h-auto py-4 justify-start hover:bg-gray-100 hover:border-gray-300 transition-colors"
            variant="outline"
            onClick={onPrintPickupList}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Printer className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Print Pickup List</p>
                  <p className="text-sm text-gray-500">Today's schedule</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
