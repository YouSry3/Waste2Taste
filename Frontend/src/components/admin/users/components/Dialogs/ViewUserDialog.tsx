import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../../../components/ui/avatar";
import { Mail, Phone, Calendar, Edit, Ban, CheckCircle } from "lucide-react";
import { User } from "../../types";
import { getInitials } from "../../utils/formatters";

interface ViewUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export function ViewUserDialog({
  user,
  open,
  onOpenChange,
  onEdit,
  onToggleStatus,
}: ViewUserDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-3 flex-1">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-green-100 text-green-700 text-xl font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-lg font-semibold">{user.name}</h4>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3" />
                  Joined {user.joined}
                </p>
              </div>
            </div>
            <Badge
              className={`h-fit cursor-pointer ${
                user.status === "Active"
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => onToggleStatus(user)}
            >
              {user.status}
            </Badge>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <a
                  href={`mailto:${user.email}`}
                  className="text-sm hover:text-green-600"
                >
                  {user.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <a
                  href={`tel:${user.phone}`}
                  className="text-sm hover:text-green-600"
                >
                  {user.phone}
                </a>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="text-lg font-semibold">{user.orders}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Total Spent</p>
              <p className="text-lg font-semibold text-green-600">
                {user.totalSpent}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Last Order</p>
            <p className="text-sm font-medium">{user.lastOrder}</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => onEdit(user)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              className={`flex-1 ${
                user.status === "Active"
                  ? "border-gray-600 text-gray-600 hover:bg-gray-50"
                  : "border-green-600 text-green-600 hover:bg-green-50"
              }`}
              onClick={() => onToggleStatus(user)}
            >
              {user.status === "Active" ? (
                <>
                  <Ban className="h-4 w-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
