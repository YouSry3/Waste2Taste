import { Outlet } from "react-router-dom";
import { UserDropdown } from "./UserDropdown";

export function PanelLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen">
      {/* Simple absolute positioning */}
      <div className="absolute top-4 right-6 z-[100]">
        <UserDropdown onLogout={onLogout} />
      </div>

      {/* Main content */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
