import { Star, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

type TopCustomer = {
  name: string;
  orders: number;
  spent: string;
  rating: number;
  imageUrl?: string | null;
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
          {customers.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
              No top customer data available yet.
            </div>
          )}
          {customers.map((customer, idx) => (
            <div
              key={customer.name}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
  {customer.imageUrl ? (
    <img
      src={customer.imageUrl}
      alt={customer.name}
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
      {idx + 1}
    </div>
  )}
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
             
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
