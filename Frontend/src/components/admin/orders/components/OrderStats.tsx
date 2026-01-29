import React from "react";
import { Card, CardContent } from "../../../ui/card";
import { DollarSign, Package, Clock, TrendingUp, Store } from "lucide-react";
import { OrderStats as OrderStatsType } from "../types/orders.types";

interface OrderStatsProps {
  stats: OrderStatsType;
}

export const OrderStatsComponent: React.FC<OrderStatsProps> = ({ stats }) => {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  ${stats.totalRevenue}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ready for Pickup</p>
                <h3 className="text-3xl font-bold text-blue-600">
                  {stats.readyForPickup}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Pickup</p>
                <h3 className="text-3xl font-bold text-yellow-600">
                  {stats.pendingPickups}
                </h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg. Order Value</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  ${stats.avgOrderValue}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Vendors */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Store className="h-5 w-5" />
            Top Performing Vendors
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-gray-400">#1</div>
                <div>
                  <p className="font-medium text-sm">Green Valley Bakery</p>
                  <p className="text-xs text-gray-500">45 orders</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-semibold">$224.55</p>
                <p className="text-xs text-gray-500">Total Revenue</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-gray-400">#2</div>
                <div>
                  <p className="font-medium text-sm">City Cafe</p>
                  <p className="text-xs text-gray-500">38 orders</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-semibold">$227.62</p>
                <p className="text-xs text-gray-500">Total Revenue</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-gray-400">#3</div>
                <div>
                  <p className="font-medium text-sm">Fresh Market</p>
                  <p className="text-xs text-gray-500">32 orders</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-semibold">$255.68</p>
                <p className="text-xs text-gray-500">Total Revenue</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
