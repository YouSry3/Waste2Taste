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
import { ModerationView } from "./components/admin/moderation/ModerationView";

// Import vendor components
import { VendorPanel } from "./components/vendor/VendorPanel";
import { VendorDashboard } from "./components/vendor/VendorDashboard";
import { MyListings } from "./components/vendor/MyListings";
import { CreateListing } from "./components/vendor/CreateListing";
import { VendorOrders } from "./components/vendor/VendorOrders";
import { VendorAnalytics } from "./components/vendor/VendorAnalytics";
import { CustomerReports } from "./components/vendor/CustomerReports";

import { CharityPanel } from "./components/charity/CharityPanel";

import { authService } from "./services/auth/authService";

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

  function ProtectedRoute({
    children,
    allowedRoles,
  }: {
    children: JSX.Element;
    allowedRoles: PanelType[];
  }) {
    if (!isAuthenticated || !currentPanel) {
      return <Navigate to="/" replace />;
    }

    // Check if current user role is allowed
    if (!allowedRoles.includes(currentPanel)) {
      // Redirect to their own panel or to login
      return <Navigate to={`/panel/${currentPanel}`} replace />;
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
            <ProtectedRoute allowedRoles={["admin", "vendor", "charity"]}>
              <PanelLayout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          {/* Admin nested routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="listings" element={<ListingsView />} />
            <Route path="orders" element={<OrdersView />} />
            <Route path="users" element={<UsersView />} />
            <Route path="vendors" element={<VendorsView />} />
            <Route path="moderation" element={<ModerationView />} />
          </Route>
          {/* Vendor nested routes */}
          <Route
            path="vendor"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorPanel />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="listings" element={<MyListings />} />
            <Route path="create-listing" element={<CreateListing />} />
            <Route path="analytics" element={<VendorAnalytics />} />
            <Route path="reports" element={<CustomerReports />} />
          </Route>
          {/* Charity */}
          <Route
            path="charity"
            element={
              <ProtectedRoute allowedRoles={["charity"]}>
                <CharityPanel />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}
