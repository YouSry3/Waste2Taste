import { LayoutDashboard, Package, Plus, BarChart3, ShoppingBag, FileWarning, Building2, MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

interface VendorSidebarProps {
  currentView: string;
  onViewChange: (view: 'dashboard' | 'orders' | 'listings' | 'create' | 'analytics' | 'reports' | 'corporate') => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'listings', label: 'Listings', icon: Package },
  { id: 'create', label: 'Create Listings', icon: Plus },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileWarning },
];

const branches = [
  'Green Valley Bakery - Downtown',
  'Green Valley Bakery - Heliopolis',
  'Green Valley Bakery - Maadi',
  'Green Valley Bakery - Nasr City',
  'Green Valley Bakery - 6th October',
];

export function VendorSidebar({ currentView, onViewChange }: VendorSidebarProps) {
  const [selectedBranches, setSelectedBranches] = useState<string[]>(branches);

  const toggleBranch = (branch: string) => {
    setSelectedBranches((prev) =>
      prev.includes(branch)
        ? prev.filter((b) => b !== branch)
        : [...prev, branch]
    );
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div>
          <h2>Corporate Panel</h2>
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