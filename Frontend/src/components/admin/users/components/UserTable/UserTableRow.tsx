import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../../../components/ui/avatar";
import { Check, Eye, ShoppingBag, Mail, Phone, Calendar } from "lucide-react";
import { User } from "../../types";
import { getInitials } from "../../utils/formatters";

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onToggleSelection: () => void;
  onViewUser: () => void;
  onToggleStatus: () => void;
}

export function UserTableRow({
  user,
  isSelected,
  onToggleSelection,
  onViewUser,
  onToggleStatus,
}: UserTableRowProps) {
  return (
    <tr
      className={`border-b transition-all ${
        isSelected
          ? "bg-green-50/50 hover:bg-green-50 border-green-100"
          : "hover:bg-gray-50"
      }`}
    >
      <td className="py-3 px-4">
        <button
          onClick={onToggleSelection}
          className="group focus:outline-none"
        >
          <div
            className={`w-5 h-5 border rounded-lg flex items-center justify-center transition-all ${
              isSelected
                ? "bg-green-600 border-green-600"
                : "border-gray-300 group-hover:border-green-400"
            }`}
          >
            {isSelected && <Check className="h-3 w-3 text-white" />}
          </div>
        </button>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {isSelected && (
              <div className="absolute -top-1 -right-1">
                <div className="bg-green-600 rounded-full p-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Joined {user.joined}
            </div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-gray-400" />
            <a href={`mailto:${user.email}`} className="hover:text-green-600">
              {user.email}
            </a>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-gray-400" />
            <a href={`tel:${user.phone}`} className="hover:text-green-600">
              {user.phone}
            </a>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <ShoppingBag className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{user.orders}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="font-semibold text-green-600">{user.totalSpent}</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-gray-600">{user.lastOrder}</span>
      </td>
      <td className="py-3 px-4">
        <Badge
          className={`cursor-pointer transition-all ${
            user.status === "Active"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } ${isSelected ? "ring-2 ring-green-300 ring-offset-1" : ""}`}
          onClick={onToggleStatus}
        >
          {user.status}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <Button
          variant="outline"
          size="sm"
          className="border-green-600 text-green-600 hover:bg-green-50"
          onClick={onViewUser}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </td>
    </tr>
  );
}
