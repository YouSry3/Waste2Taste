import { LayoutDashboard, Package, Users, Store, ShoppingBag, Map, Shield } from 'lucide-react';
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
} from './ui/sidebar';

interface AdminSidebarProps {
  currentView: string;
  onViewChange: (view: 'dashboard' | 'listings' | 'users' | 'vendors' | 'orders' | 'map' | 'moderation') => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'listings', label: 'Listings', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'vendors', label: 'Vendors', icon: Store },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'moderation', label: 'Moderation', icon: Shield },
];

export function AdminSidebar({ currentView, onViewChange }: AdminSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2>Food Rescue</h2>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
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
                    onClick={() => onViewChange(item.id as any)}
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
