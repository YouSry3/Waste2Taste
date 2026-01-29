// src/components/admin/dashboard/components/charts/CategoryChart.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Scrollbars } from "react-custom-scrollbars-2";
import { CustomPieTooltip } from "../charts/CustomPieTooltip";
import { CategoryData } from "../../types";

interface CategoryChartProps {
  data: CategoryData[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Listings by Category</CardTitle>
        <CardDescription>Marketplace distribution</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Scrollbars
          autoHide
          autoHideTimeout={500}
          autoHideDuration={200}
          style={{ height: 400 }}
          renderThumbVertical={({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                backgroundColor: "#10b981",
                borderRadius: "8px",
                width: "8px",
              }}
            />
          )}
        >
          <div className="h-[250px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4">
            <div className="grid gap-2">
              {data.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-500 ml-auto flex-shrink-0">
                    {category.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Scrollbars>
      </CardContent>
    </Card>
  );
}
