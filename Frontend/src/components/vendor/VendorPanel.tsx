// src/components/vendor/VendorPanel.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import { VendorSidebar } from "./VendorSidebar";
import { Menu } from "lucide-react";

export function VendorPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex min-h-[calc(100vh-57px)] w-full">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <VendorSidebar />

        <main className="flex-1 bg-gray-50 w-full flex flex-col">
          {/* Mobile header with menu button */}
          <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
            <h1 className="font-semibold text-base text-gray-900">Vendor Panel</h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Scrollable content area */}
          <div className="overflow-auto">
            <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
