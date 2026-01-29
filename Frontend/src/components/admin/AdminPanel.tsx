// src/components/admin/AdminPanel.tsx
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";

export function AdminPanel() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}