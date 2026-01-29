// src/components/layout/PanelLayout.tsx
import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export function PanelLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <>
      <div className="absolute top-4 right-6 z-10">
        <Button variant="ghost" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
      <Outlet />
    </>
  );
}
