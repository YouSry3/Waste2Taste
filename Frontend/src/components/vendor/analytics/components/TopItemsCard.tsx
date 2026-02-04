import { TrendingDown, TrendingUp, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

type TopItem = {
  name: string;
  sold: number;
  revenue: number;
  rating: number;
  trend: number;
};

interface TopItemsCardProps {
  items: TopItem[];
}

export function TopItemsCard({ items }: TopItemsCardProps) {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Top Performing Items
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Best sellers this month
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">
                      {item.rating}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {item.sold} units sold
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  ${item.revenue.toFixed(2)}
                </p>
                <div className="flex items-center gap-1 justify-end mt-1">
                  {item.trend >= 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600">
                        +{item.trend}%
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3 text-red-600" />
                      <span className="text-xs text-red-600">
                        {item.trend}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
