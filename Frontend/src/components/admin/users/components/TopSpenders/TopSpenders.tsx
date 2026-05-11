import { Card, CardContent } from "../../../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../../../components/ui/avatar";
import { User } from "../../types";
import { getInitials } from "../../utils/formatters";

interface TopSpenderData {
  id: string;
  fullName: string;
  initials: string;
  totalSpent: number;
  rank: number;
}

interface TopSpendersProps {
  users?: User[];
  topSpenders?: TopSpenderData[];
}

export function TopSpenders({ users, topSpenders }: TopSpendersProps) {
  let spendersToDisplay: TopSpenderData[] = [];

  if (topSpenders && topSpenders.length > 0) {
    // 🔴 FIX: Ensure ranks from API are valid (1-based), re-rank if needed
    const hasValidRanks = topSpenders.every(s => typeof s.rank === 'number' && s.rank > 0);
    
    if (hasValidRanks) {
      spendersToDisplay = topSpenders;
    } else {
      // Re-rank if API sends 0 or invalid ranks
      spendersToDisplay = topSpenders
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .map((spender, index) => ({
          ...spender,
          rank: index + 1,
        }));
    }
  } else if (users && users.length > 0) {
    spendersToDisplay = users
      .map((user) => ({
        id: user.id.toString(),
        fullName: user.fullName,
        initials: getInitials(user.fullName),
        totalSpent: user.totalSpent || 0,
        rank: 0, // placeholder, will be overwritten
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 3)
      .map((spender, index) => ({ ...spender, rank: index + 1 }));
  }

  if (spendersToDisplay.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="text-yellow-500">⭐</span> Top Spenders
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {spendersToDisplay.map((spender) => (
            <div
              key={spender.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="text-2xl font-bold text-gray-400">
                #{spender.rank || 1}  {/* 🔴 Fallback to 1 if rank is 0/undefined */}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-green-100 text-green-700">
                  {spender.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{spender.fullName || 'Unknown User'}</p>
                <p className="text-green-600 font-semibold">
                  ${typeof spender.totalSpent === 'number' && !isNaN(spender.totalSpent) ? spender.totalSpent.toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}