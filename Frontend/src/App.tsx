import { SidebarProvider } from "./components/ui/sidebar";
import { Button } from "./components/ui/button";
import { Shield, Store, Heart, LogOut } from "lucide-react";

import { AdminPanel } from "./components/admin/AdminPanel";
import { VendorPanel } from "./components/vendor/VendorPanel";
import { CharityPanel } from "./components/charity/CharityPanel";

import { LoginPage } from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage"; // ✅ default import
import ResetPasswordPage from "./components/auth/ResetPasswordPage"; // ✅ new page

import { authService } from "./services/auth/authService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

type PanelType = "admin" | "vendor" | "charity";

const queryClient = new QueryClient();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!authService.getCurrentUser()
  );

  const [currentPanel, setCurrentPanel] = useState<PanelType | null>(
    authService.getPanelType()
  );

  const handleLogin = (panelType: PanelType) => {
    setCurrentPanel(panelType);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setCurrentPanel(null);
  };

  function UserMenu() {
    const [open, setOpen] = useState(false);
    const user = authService.getCurrentUser();

    if (!user) return null;

    return (
      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-medium text-gray-800">{user.name}</span>
            <span className="text-gray-500 capitalize text-xs">
              {user.panelType}
            </span>
          </div>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-600"
              onClick={async () => {
                await authService.logout();
                window.location.reload();
              }}
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* LOGIN PAGE */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <LoginPage onLogin={handleLogin} />
            ) : (
              <Navigate to="/panel" replace />
            )
          }
        />

        {/* SIGN UP PAGE */}
        <Route
          path="/signup"
          element={
            !isAuthenticated ? <SignupPage /> : <Navigate to="/panel" replace />
          }
        />

        {/* RESET PASSWORD PAGE */}
        <Route
          path="/reset-password"
          element={
            !isAuthenticated ? (
              <ResetPasswordPage />
            ) : (
              <Navigate to="/panel" replace />
            )
          }
        />

        {/* PROTECTED PANEL */}
        <Route
          path="/panel"
          element={
            isAuthenticated && currentPanel ? (
              <div className="min-h-screen bg-gray-50">
                {/* NAVBAR */}
                <div className="bg-white border-b px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                        <Store className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="font-semibold text-gray-800">
                        Food Rescue Platform
                      </h2>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                      {authService.getCurrentUser() && <UserMenu />}
                    </div>
                  </div>
                </div>

                {/* PANEL CONTENT */}
                <SidebarProvider>
                  {currentPanel === "admin" && <AdminPanel />}
                  {currentPanel === "vendor" && <VendorPanel />}
                  {currentPanel === "charity" && <CharityPanel />}
                </SidebarProvider>
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ANY UNKNOWN ROUTE */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}
