import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

type CustomerInsight = {
  name: string;
  orders: number;
  spent: number;
  rating: number;
};

interface TopCustomersCardProps {
  customers: CustomerInsight[];
}

export function TopCustomersCard({ customers }: TopCustomersCardProps) {
  if (customers.length === 0) {
    return (
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Top Customers
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Most valuable customers
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
            No customer insights returned yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Top Customers
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Most valuable customers
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {customers.map((customer, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {customer.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {customer.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {customer.orders} orders
                    </span>
                    <span className="text-gray-300">-</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">
                        {customer.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  ${customer.spent.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
