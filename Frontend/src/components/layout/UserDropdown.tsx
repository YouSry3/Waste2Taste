import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  LogOut,
  User,
  Settings,
  Shield,
  Store,
  Heart,
  ChevronDown,
} from "lucide-react";
import { authService } from "../../services/auth/authService";

interface UserDropdownProps {
  onLogout: () => void;
}

export function UserDropdown({ onLogout }: UserDropdownProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [panelType, setPanelType] = useState<string>("");

  useEffect(() => {
    const userData = authService.getCurrentUser();
    const panel = authService.getPanelType();
    setUser(userData);
    setPanelType(panel || "");
  }, []);

  const handleProfileClick = () => {
    if (panelType) {
      navigate(`/panel/${panelType}/profile`);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPanelIcon = () => {
    switch (panelType) {
      case "admin":
        return <Shield className="h-4 w-4 text-blue-600" />;
      case "vendor":
        return <Store className="h-4 w-4 text-green-600" />;
      case "charity":
        return <Heart className="h-4 w-4 text-red-600" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getPanelLabel = () => {
    switch (panelType) {
      case "admin":
        return "Admin Panel";
      case "vendor":
        return "Vendor Panel";
      case "charity":
        return "Charity Panel";
      default:
        return "Panel";
    }
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors relative z-50"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white font-semibold">
                {getInitials(user?.name || "User")}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-gray-500">{getPanelLabel()}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 bg-white z-[9999]"
          style={{ zIndex: 9999 }}
        >
          <DropdownMenuLabel className="flex items-center gap-2">
            {getPanelIcon()}
            <div className="flex flex-col">
              <span>{user?.name || "User"}</span>
              <span className="text-xs font-normal text-gray-500">
                {user?.email || ""}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleProfileClick}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={onLogout}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
