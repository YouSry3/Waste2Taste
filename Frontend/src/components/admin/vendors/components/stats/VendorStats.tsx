import { Card, CardContent } from "../../../../ui/card";

interface VendorStatsProps {
  stats: {
    totalVendors: number;
    ngoPartners: number;
    activeListings: number;
    totalRevenue: number;
  };
}

export function VendorStats({ stats }: VendorStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 mb-1">Total Vendors</p>
          <h3 className="text-3xl font-bold text-gray-900">
            {stats.totalVendors}
          </h3>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 mb-1">NGO Partners</p>
          <h3 className="text-3xl font-bold text-gray-900">
            {stats.ngoPartners}
          </h3>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 mb-1">Active Listings</p>
          <h3 className="text-3xl font-bold text-gray-900">
            {stats.activeListings}
          </h3>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold text-green-600">
            $
            {stats.totalRevenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
        </CardContent>
      </Card>
    </div>
  );
}
