import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Check, UserPlus } from "lucide-react";
import { User } from "../../types";
import { UserTableRow } from "./UserTableRow";

interface UserTableProps {
  users: User[];
  selectedUsers: number[];
  isSelectAll: boolean;
  onToggleSelectAll: () => void;
  onToggleUserSelection: (userId: number) => void;
  onViewUser: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export function UserTable({
  users,
  selectedUsers,
  isSelectAll,
  onToggleSelectAll,
  onToggleUserSelection,
  onViewUser,
  onToggleStatus,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 pe-4 ps-1 font-semibold w-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleSelectAll}
                    className={`flex items-center justify-start gap-2 transition-all ${
                      isSelectAll
                        ? "bg-green-50 border-green-600 text-green-600"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${
                        isSelectAll
                          ? "bg-green-600 border-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelectAll && <Check className="h-3 w-3 text-white" />}
                    </div>
                    Select All
                  </Button>
                </th>
                <th className="text-left py-3 px-4 font-semibold">User</th>
                <th className="text-left py-3 px-4 font-semibold">Contact</th>
                <th className="text-left py-3 px-4 font-semibold">Orders</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Total Spent
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  Last Order
                </th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isSelected={selectedUsers.includes(user.id)}
                  onToggleSelection={() => onToggleUserSelection(user.id)}
                  onViewUser={() => onViewUser(user)}
                  onToggleStatus={() => onToggleStatus(user)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
