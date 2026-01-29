// src/components/admin/dashboard/components/cards/StatsCard.tsx
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "../../../../ui/card";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { StatsData } from "../../types";

interface StatsCardProps {
  stat: StatsData;
}

export function StatsCard({ stat }: StatsCardProps) {
  const Icon = stat.icon;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-3 rounded-xl ${stat.bgColor}`}>
            <Icon className={`h-6 w-6 ${stat.color}`} />
          </div>
          <div className="flex items-center gap-1">
            {stat.isPositive ? (
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            )}
            <span
              className={`text-sm font-medium ${stat.isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {stat.change}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stat.value}
          </h3>
          <p className="text-xs text-gray-400">{stat.description}</p>
        </div>

        <div className="mt-4">
          <ResponsiveContainer width="100%" height={30}>
            <AreaChart data={stat.trend.map((value) => ({ value }))}>
              <Area
                type="monotone"
                dataKey="value"
                stroke={stat.isPositive ? "#10b981" : "#ef4444"}
                fill={stat.isPositive ? "#d1fae5" : "#fee2e2"}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
