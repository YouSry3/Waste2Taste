import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

type WeeklyDataItem = {
  day: string;
  sales: number;
  items: number;
  pickups: number;
};

interface WeeklyPerformanceCardProps {
  data: WeeklyDataItem[];
}

export function WeeklyPerformanceCard({ data }: WeeklyPerformanceCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle>Weekly Performance</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Week
            </Button>
            <Button variant="ghost" size="sm">
              Month
            </Button>
            <Button variant="ghost" size="sm">
              Quarter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            <Bar
              dataKey="sales"
              fill="#10b981"
              name="Sales ($)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pickups"
              fill="#3b82f6"
              name="Pickups"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
