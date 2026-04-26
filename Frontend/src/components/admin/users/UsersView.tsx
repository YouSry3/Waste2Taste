import { useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useUsers } from "./hooks/useUsers";
import { useUserForm } from "./hooks/useUserForm";
import { useSortFilter } from "./hooks/useSortFilter";
import { useBulkActions } from "./hooks/useBulkActions";
import { User } from "./types";
import { useExport } from "./hooks/useExport";
import { useUsersOverview } from "./hooks/useUsersOverview";
import { UserStats } from "./components/UserStats";
import { UserFilters } from "./components/UserFilters";
import { TopSpenders } from "./components/TopSpenders";
import { UserTable } from "./components/UserTable";
import { BulkActions } from "./components/BulkActions";
import {
  AddUserDialog,
  EditUserDialog,
  ViewUserDialog,
} from "./components/Dialogs";
import { Button } from "../../../components/ui/button";
import { Download } from "lucide-react";

export function UsersView() {
  const {
    searchTerm,
    filterStatus,
    sortBy,
    sortOrder,
    setSearchTerm,
    setFilterStatus,
    toggleSort,
  } = useSortFilter();

  const apiParams = useMemo(
    () => ({
      search: searchTerm,
      status: filterStatus,
      sortBy,
      sortOrder,
      page: 1,
      pageSize: 10,
    }),
    [searchTerm, filterStatus, sortBy, sortOrder],
  );

  const { users, addUser, updateUser, toggleStatus, deleteUsers } = useUsers(
    apiParams,
  );
  const { formData, formErrors, handleInputChange, validateForm, resetForm } =
    useUserForm();
  const {
    selectedUsers,
    isSelectAll,
    clearSelection,
    toggleUserSelection,
    toggleSelectAll,
    handleBulkAction,
  } = useBulkActions(users, users, {
    toggleStatus,
    deleteUsers,
  });
  const { handleExportCSV } = useExport();
  const { overview } = useUsersOverview();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    resetForm({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      ordersCount: user.ordersCount.toString(),
      totalSpent: user.totalSpent.toString(),
      isActive: user.isActive,
      joinedAt: user.joinedAt.split('T')[0], // Convert ISO date to date input format
      lastOrderDate: user.lastOrderDate ? user.lastOrderDate.split('T')[0] : "",
    });
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleAddUser = () => {
    if (!validateForm()) return;
    addUser(formData);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditUser = () => {
    if (!validateForm() || !selectedUser) return;
    updateUser(selectedUser.id, formData);
    resetForm();
    setIsEditDialogOpen(false);
    setIsViewDialogOpen(false);
  };

  return (
    <div className="p-8">
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#10b981",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "white",
            },
          },
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-gray-500">Manage customer accounts</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-green-50 border-green-600 border text-green-600"
            onClick={() => handleExportCSV(users)}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <AddUserDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            formData={formData}
            formErrors={formErrors}
            onInputChange={handleInputChange}
            onAddUser={handleAddUser}
            onResetForm={resetForm}
          />
        </div>
      </div>

      {/* Stats */}
      {overview ? (
        <UserStats overview={overview} />
      ) : (
        <UserStats users={users} />
      )}

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <BulkActions
          selectedCount={selectedUsers.length}
          onClear={() => {
            clearSelection();
          }}
          onBulkAction={handleBulkAction}
        />
      )}

      {/* Top Spenders */}
      {overview && overview.topSpenders ? (
        <TopSpenders topSpenders={overview.topSpenders} />
      ) : (
        <TopSpenders users={users} />
      )}

      {/* Search and Filter */}
      <UserFilters
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilterStatus}
        onSortChange={toggleSort}
      />

      {/* Users Table */}
      <UserTable
        users={users}
        selectedUsers={selectedUsers}
        isSelectAll={isSelectAll}
        onToggleSelectAll={toggleSelectAll}
        onToggleUserSelection={toggleUserSelection}
        onViewUser={(user) => {
          setSelectedUser(user);
          setIsViewDialogOpen(true);
        }}
        onToggleStatus={toggleStatus}
      />

      {/* Dialogs */}
      <ViewUserDialog
        user={selectedUser}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onEdit={openEditDialog}
        onToggleStatus={toggleStatus}
      />

      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        formErrors={formErrors}
        onInputChange={handleInputChange}
        onSave={handleEditUser}
        onCancel={() => {
          setIsEditDialogOpen(false);
          resetForm();
        }}
      />
    </div>
  );
}
