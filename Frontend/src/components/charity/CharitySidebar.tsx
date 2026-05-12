import { LayoutDashboard, UserCheck, Users, Package, BarChart3 } from 'lucide-react';
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
} from '../ui/sidebar';

interface CharitySidebarProps {
  currentView: string;
  onViewChange: (view: 'dashboard' | 'requests' | 'approved' | 'listings' | 'analytics') => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'requests', label: 'Verification Requests', icon: UserCheck },
  { id: 'approved', label: 'Approved Users', icon: Users },
  { id: 'listings', label: 'Product Listings', icon: Package },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export function CharitySidebar({ currentView, onViewChange }: CharitySidebarProps) {
  return (
    <Sidebar className="hidden md:flex fixed md:relative h-screen md:h-auto z-40 md:z-0">
      <SidebarHeader className="border-b px-6 py-4">
        <div>
          <h2 className="font-semibold text-base md:text-lg">Charity Panel</h2>
          <p className="text-xs md:text-sm text-gray-500">Community Food Bank</p>
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
                    onClick={() => onViewChange(item.id as any)}
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