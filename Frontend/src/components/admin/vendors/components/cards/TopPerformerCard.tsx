import { Card, CardContent } from "../../../../ui/card";
import { Vendor } from "../../api/vendors.types";

interface TopPerformersProps {
  vendors: Vendor[];
}

export function TopPerformers({ vendors }: TopPerformersProps) {
  if (vendors.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="text-yellow-500">⭐</span> Top Performers by Revenue
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vendors.map((vendor, index) => (
            <div
              key={vendor.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="text-2xl font-bold text-gray-400">
                #{index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{vendor.name}</p>
                <p className="text-green-600 font-semibold">{vendor.revenue}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
