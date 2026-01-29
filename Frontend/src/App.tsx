import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LoginPage } from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import EnterResetCodePage from "./components/auth/EnterResetCodePage";

import { PanelLayout } from "./components/layout/PanelLayout";

import { AdminPanel } from "./components/admin/AdminPanel";
import { Dashboard } from "./components/admin/dashboard/DashboardView";
import { ListingsView } from "./components/admin/listings/ListingsView";
import { OrdersView } from "./components/admin/orders/OrdersView";
import { UsersView } from "./components/admin/users/UsersView";
import { VendorsView } from "./components/admin/vendors/pages/VendorsView";

import { VendorPanel } from "./components/vendor/VendorPanel";
import { CharityPanel } from "./components/charity/CharityPanel";

import { authService } from "./services/auth/authService";
import { ModerationView } from "./components/admin/moderation/ModerationView";

type PanelType = "admin" | "vendor" | "charity";

const queryClient = new QueryClient();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!authService.getCurrentUser(),
  );
  const [currentPanel, setCurrentPanel] = useState<PanelType | null>(
    authService.getPanelType(),
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

  function ProtectedRoute({ children }: { children: JSX.Element }) {
    if (!isAuthenticated || !currentPanel) {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* AUTH */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <LoginPage onLogin={handleLogin} />
            ) : (
              <Navigate to={`/panel/${currentPanel}`} replace />
            )
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/enter-reset-code" element={<EnterResetCodePage />} />

        {/* PANEL */}
        <Route
          path="/panel"
          element={
            <ProtectedRoute>
              <PanelLayout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          {/* Admin nested routes */}
          <Route path="admin" element={<AdminPanel />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="listings" element={<ListingsView />} />
            <Route path="orders" element={<OrdersView />} />
            <Route path="users" element={<UsersView />} />
            <Route path="vendors" element={<VendorsView />} />
            <Route path="moderation" element={<ModerationView />} />
          </Route>

          {/* Vendor and charity */}
          <Route path="vendor" element={<VendorPanel />} />
          <Route path="charity" element={<CharityPanel />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}
