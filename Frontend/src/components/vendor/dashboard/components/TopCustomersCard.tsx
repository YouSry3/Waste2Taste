import { Star, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

type TopCustomer = {
  name: string;
  orders: number;
  spent: string;
  rating: number;
};

interface TopCustomersCardProps {
  customers: TopCustomer[];
}

export function TopCustomersCard({ customers }: TopCustomersCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          <CardTitle>Top Customers</CardTitle>
        </div>
        <p className="text-sm text-gray-500">Your most loyal customers</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {customers.map((customer, idx) => (
            <div
              key={customer.name}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">
                    {customer.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {customer.orders} orders • {customer.spent}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{customer.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
