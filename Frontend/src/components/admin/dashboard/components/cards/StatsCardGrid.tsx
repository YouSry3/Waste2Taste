// src/components/admin/dashboard/components/cards/StatsCardGrid.tsx
import { StatsCard } from "./StatsCard";
import { StatsData } from "../../types";

interface StatsCardGridProps {
  stats: StatsData[];
}

export function StatsCardGrid({ stats }: StatsCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <StatsCard key={stat.title} stat={stat} />
      ))}
    </div>
  );
}
