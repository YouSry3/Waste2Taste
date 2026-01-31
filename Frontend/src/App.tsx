// App.tsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { LoginPage } from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import EnterResetCodePage from "./components/auth/EnterResetCodePage";

import { PanelLayout } from "./components/layout/PanelLayout";

import { AdminPanel } from "./components/admin/AdminPanel";
import { Dashboard } from "./components/admin/dashboard/DashboardView";
import { ListingsView } from "./components/admin/listings/ListingsView";
import { UsersView } from "./components/admin/users/UsersView";
import { VendorsView } from "./components/admin/vendors/pages/VendorsView";
import { ModerationView } from "./components/admin/moderation/ModerationView";

import { VendorPanel } from "./components/vendor/VendorPanel";
import { VendorDashboard } from "./components/vendor/VendorDashboard";
import { MyListings } from "./components/vendor/MyListings";
import { CreateListing } from "./components/vendor/CreateListing";
import { VendorOrders } from "./components/vendor/orders/VendorOrders";
import { VendorAnalytics } from "./components/vendor/VendorAnalytics";
import { CustomerReports } from "./components/vendor/CustomerReports";

import { CharityPanel } from "./components/charity/CharityPanel";

import { authService } from "./services/auth/authService";

type PanelType = "admin" | "vendor" | "charity";

export default function App() {
  // Initialize state from localStorage once
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return authService.isAuthenticated();
  });

  const [currentPanel, setCurrentPanel] = useState<PanelType | null>(() => {
    return authService.getPanelType();
  });

  const handleLogin = (panelType: PanelType) => {
    setCurrentPanel(panelType);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setCurrentPanel(null);
  };

  // Protected Route Component
  function ProtectedRoute({
    children,
    allowedRoles,
  }: {
    children: JSX.Element;
    allowedRoles: PanelType[];
  }) {
    // If not authenticated, redirect to login
    if (!isAuthenticated || !currentPanel) {
      return <Navigate to="/" replace />;
    }

    // If authenticated but wrong role, redirect to their correct panel
    if (!allowedRoles.includes(currentPanel)) {
      return <Navigate to={`/panel/${currentPanel}/dashboard`} replace />;
    }

    return children;
  }

  return (
    <Routes>
      {/* AUTH ROUTES */}
      <Route
        path="/"
        element={
          isAuthenticated && currentPanel ? (
            <Navigate to={`/panel/${currentPanel}/dashboard`} replace />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/enter-reset-code" element={<EnterResetCodePage />} />

      {/* PROTECTED PANEL ROUTES */}
      <Route
        path="/panel"
        element={
          <ProtectedRoute allowedRoles={["admin", "vendor", "charity"]}>
            <PanelLayout onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        {/* Admin Routes */}
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
          <Route path="users" element={<UsersView />} />
          <Route path="vendors" element={<VendorsView />} />
          <Route path="moderation" element={<ModerationView />} />
        </Route>

        {/* Vendor Routes */}
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

        {/* Charity Routes */}
        <Route
          path="charity"
          element={
            <ProtectedRoute allowedRoles={["charity"]}>
              <CharityPanel />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
