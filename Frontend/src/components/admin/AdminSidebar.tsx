// src/components/admin/AdminSidebar.tsx
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Store,
  Shield,
  X,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/panel/admin" },
  { label: "Vendors", icon: Store, to: "/panel/admin/vendors" },
  { label: "Users", icon: Users, to: "/panel/admin/users" },
  { label: "Moderation", icon: Shield, to: "/panel/admin/moderation" },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (to: string) => {
    navigate(to);
    onClose?.();
  };

  return (
    <aside className={`
      fixed md:relative md:translate-x-0 top-0 left-0 h-screen z-40
      w-64 bg-white border-r border-gray-200 flex-shrink-0
      overflow-y-auto transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Close button for mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      )}

      {/* Header */}
      <div className="border-b px-6 py-4 mt-10 md:mt-0">
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
                    onClick={() => handleNavigate(item.to)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm md:text-base font-medium transition-colors
                      ${
                        active
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
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
