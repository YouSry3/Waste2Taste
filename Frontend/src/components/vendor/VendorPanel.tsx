// src/components/vendor/VendorPanel.tsx
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import { VendorSidebar } from "./VendorSidebar";

export function VendorPanel() {
  return (
    <SidebarProvider>
      <div className="flex min-h-[calc(100vh-57px)] w-full">
        <VendorSidebar />
        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
