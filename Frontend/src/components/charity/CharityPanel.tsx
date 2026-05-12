import { useState } from "react";
import { SidebarProvider } from "../ui/sidebar";
import { CharitySidebar } from "./CharitySidebar";
import { CharityDashboard } from "./CharityDashboard";
import { VerificationRequests } from "./VerificationRequests";
import { ApprovedUsers } from "./ApprovedUsers";
import { FreeListings } from "./FreeListings";
import { CharityAnalytics } from "./CharityAnalytics";
import { Menu } from "lucide-react";

export function CharityPanel() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "requests" | "approved" | "listings" | "analytics"
  >("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <CharityDashboard />;
      case "requests":
        return <VerificationRequests />;
      case "approved":
        return <ApprovedUsers />;
      case "listings":
        return <FreeListings />;
      case "analytics":
        return <CharityAnalytics />;
      default:
        return <CharityDashboard />;
    }
  };

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

        <CharitySidebar
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        <main className="flex-1 bg-gray-50 w-full flex flex-col">
          {/* Mobile header with menu button */}
          <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
            <h1 className="font-semibold text-base text-gray-900">Charity Panel</h1>
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
              {renderView()}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
