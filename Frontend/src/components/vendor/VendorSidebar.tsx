// src/components/vendor/VendorSidebar.tsx
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Plus,
  BarChart3,
  ShoppingBag,
  FileWarning,
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

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div>
          <h2 className="font-semibold">Vendor Panel</h2>
          <p className="text-sm text-gray-500">Green Valley Bakery</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={currentView === item.id}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
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
