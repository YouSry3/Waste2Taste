// src/components/admin/dashboard/components/charts/CustomPieTooltip.tsx
interface PieTooltipPayload {
  payload?: {
    name: string;
    value: number;
    color: string;
    listings: number;
    revenue: string;
  };
}

interface CustomPieTooltipProps {
  active?: boolean;
  payload?: PieTooltipPayload[];
}

export function CustomPieTooltip({ active, payload }: CustomPieTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: data?.color }}
          />
          <p className="font-semibold text-gray-900">{data?.name}</p>
        </div>
        <p className="text-sm text-gray-600">{data?.value}% of listings</p>
        <p className="text-sm text-gray-600">{data?.listings} active listings</p>
        <p className="text-sm font-semibold text-green-600">
          {data?.revenue} revenue
        </p>
      </div>
    );
  }
  return null;
}
