// src/components/admin/AdminSidebar.tsx
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Store,
  Shield,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/panel/admin" },
  { label: "Listings", icon: Package, to: "/panel/admin/listings" },
  { label: "Orders", icon: ShoppingBag, to: "/panel/admin/orders" },
  { label: "Vendors", icon: Store, to: "/panel/admin/vendors" },
  { label: "Users", icon: Users, to: "/panel/admin/users" },
  { label: "Moderation", icon: Shield, to: "/panel/admin/moderation" },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h2 className="font-semibold text-lg">Moderation Panel</h2>
        <p className="text-sm text-gray-500">Platform Management</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="mb-2">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Navigation
          </p>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);

              return (
                <li key={item.to}>
                  <button
                    onClick={() => navigate(item.to)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        active
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
