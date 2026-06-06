// src/components/vendor/VendorSidebar.tsx
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Plus,
  BarChart3,
  ShoppingBag,
  FileWarning,
  MessageSquare,
  X,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "../ui/sidebar";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/panel/vendor/dashboard",
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingBag,
    path: "/panel/vendor/orders",
  },
  {
    id: "listings",
    label: "Listings",
    icon: Package,
    path: "/panel/vendor/listings",
  },
  {
    id: "create-listing",
    label: "Create Listing",
    icon: Plus,
    path: "/panel/vendor/create-listing",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    path: "/panel/vendor/analytics",
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: MessageSquare,
    path: "/panel/vendor/reviews",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileWarning,
    path: "/panel/vendor/reports",
  },
];

export function VendorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract current view from path
  const currentPath = location.pathname;
  const currentView =
    menuItems.find((item) => currentPath.includes(item.id))?.id || "dashboard";

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Sidebar className="hidden md:flex fixed md:relative h-screen md:h-auto z-40 md:z-0">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-base md:text-lg">Vendor Panel</h2>
            <p className="text-xs md:text-sm text-gray-500">Green Valley Bakery</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs md:text-sm">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleNavigate(item.path)}
                    isActive={currentView === item.id}
                    className="text-sm md:text-base"
                  >
                    <item.icon className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
