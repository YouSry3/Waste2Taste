import { Card, CardContent } from "../../../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../../../components/ui/avatar";
import { User } from "../../types";
import { getInitials } from "../../utils/formatters";

interface TopSpendersProps {
  users: User[];
}

export function TopSpenders({ users }: TopSpendersProps) {
  const topSpenders = [...users]
    .sort(
      (a, b) =>
        parseFloat(b.totalSpent.replace(/[$,]/g, "")) -
        parseFloat(a.totalSpent.replace(/[$,]/g, "")),
    )
    .slice(0, 3);

  if (topSpenders.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="text-yellow-500">⭐</span> Top Spenders
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topSpenders.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="text-2xl font-bold text-gray-400">
                #{index + 1}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-green-100 text-green-700">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-green-600 font-semibold">
                  {user.totalSpent}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
