import React from "react";
import { Card, CardContent } from "../../../ui/card";
import { DollarSign, Package, Clock, TrendingUp, Store } from "lucide-react";
import { OrderStats as OrderStatsType } from "../types/orders.types";

interface OrderStatsProps {
  stats: OrderStatsType;
}

export const OrderStatsComponent: React.FC<OrderStatsProps> = ({ stats }) => {
  const formatMoney = (value: number) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
                  ${formatMoney(stats.totalRevenue)}
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
                  ${formatMoney(stats.avgOrderValue)}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    
    </>
  );
};
