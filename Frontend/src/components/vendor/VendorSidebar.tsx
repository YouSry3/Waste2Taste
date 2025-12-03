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
  { id: 'corporate', label: 'Corporate Control', icon: Building2 },
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
          <SidebarGroupLabel>Branch Selection</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 mb-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">
                        {selectedBranches.length === branches.length
                          ? 'All Branches'
                          : selectedBranches.length === 1
                          ? selectedBranches[0].split(' - ')[1]
                          : `${selectedBranches.length} Branches`}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  {branches.map((branch) => (
                    <DropdownMenuCheckboxItem
                      key={branch}
                      checked={selectedBranches.includes(branch)}
                      onCheckedChange={() => toggleBranch(branch)}
                    >
                      {branch}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
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