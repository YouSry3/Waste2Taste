import { Card, CardContent } from "../../../../ui/card";

interface VendorStatsProps {
  stats: {
    totalVendors: number | string;
    ngoPartners: number | string;
    activeListings: number | string;
    totalRevenue: number | string;
  };
}

export function VendorStats({ stats }: VendorStatsProps) {
  const renderStatValue = (value: number | string, isRevenue = false) => {
    if (typeof value === "number") {
      if (isRevenue) {
        return `$${value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }
      return value;
    }

    return value;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 mb-1">Total Vendors</p>
          <h3 className="text-3xl font-bold text-gray-900">
            {renderStatValue(stats.totalVendors)}
          </h3>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 mb-1">NGO Partners</p>
          <h3 className="text-3xl font-bold text-gray-900">
            {renderStatValue(stats.ngoPartners)}
          </h3>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 mb-1">Active Listings</p>
          <h3 className="text-3xl font-bold text-gray-900">
            {renderStatValue(stats.activeListings)}
          </h3>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold text-green-600">
            {renderStatValue(stats.totalRevenue, true)}
          </h3>
        </CardContent>
      </Card>
    </div>
  );
}
