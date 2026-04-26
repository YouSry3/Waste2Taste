import { Toaster } from "react-hot-toast";
import { useVendors } from "../hooks/useVendors";
import { Header } from "../components/layout/Header";
import { VendorStats } from "../components/stats/VendorStats";
import { TopPerformers } from "../components/cards/TopPerformerCard";
import { VendorFilters } from "../components/filters/VendorFilters";
import { VendorCard } from "../components/cards/VendorCard";
import { EmptyState } from "../components/layout/EmptyState";
import { VendorDialog } from "../components/dialogs/VendorDialog";
import { VendorFormDialog } from "../components/dialogs/VendorFormDialog";
import { DeleteConfirmationDialog } from "../components/dialogs/DeleteConfirmationDialog";

export function VendorsView() {
  const {
    // State
    vendors,
    filteredVendors,
    selectedVendor,
    vendorToDelete,

    // Filter State
    searchTerm,
    filterType,
    filterCategory,
    filterStatus,
    sortBy,
    sortOrder,

    // Form State
    formData,
    formErrors,
    handleInputChange,
    resetForm,

    // Actions
    handleAddVendor,
    handleEditVendor,
    handleDeleteVendor,
    handleToggleStatus,
    handleExportCSV,
    toggleSort,
    resetFilters,
    openEditDialog,
    openDeleteDialog,

    // UI State
    isDialogOpen,
    setIsDialogOpen,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,

    // Setters
    setSearchTerm,
    setFilterType,
    setFilterCategory,
    setFilterStatus,
    setSelectedVendor,
    setVendorToDelete,

    // Computed
    stats,
    topPerformers,
    hasActiveFilters,
    categories,
  } = useVendors();

  const handleOpenAddDialog = () => {
    resetForm(); // Clear the form before opening add dialog
    setIsAddDialogOpen(true);
  };

  return (
    <div className="p-8">
      <Toaster position="top-right" />

      <Header
        onAddVendor={handleOpenAddDialog} // Use the new function
        onExport={handleExportCSV}
      />

      <VendorStats stats={stats} />

      <TopPerformers vendors={topPerformers} />

      <VendorFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortBy={sortBy}
        sortOrder={sortOrder}
        toggleSort={toggleSort}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
        categories={categories}
      />

      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Showing {filteredVendors.length} of {vendors.length} vendor

          
          {vendors.length !== 1 ? "s" : ""}
        </p>
      </div>

      {filteredVendors.length === 0 ? (
        <EmptyState hasFilters={hasActiveFilters} resetFilters={resetFilters} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onViewDetails={() => {
                setSelectedVendor(vendor);
                setIsDialogOpen(true);
              }}
              onToggleStatus={() => handleToggleStatus(vendor)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <VendorDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        vendor={selectedVendor}
        onToggleStatus={() =>
          selectedVendor && handleToggleStatus(selectedVendor)
        }
        onEdit={() => {
          if (selectedVendor) {
            openEditDialog(selectedVendor);
          }
        }}
        onDelete={() => {
          if (selectedVendor) {
            openDeleteDialog(selectedVendor);
          }
        }}
      />

      <VendorFormDialog
        type="add"
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          resetForm(); // Also reset form when closing add dialog
        }}
        onSubmit={handleAddVendor}
        formData={formData}
        formErrors={formErrors}
        handleInputChange={handleInputChange}
        resetForm={resetForm}
      />

      <VendorFormDialog
        type="edit"
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          resetForm(); // Reset form when closing edit dialog too
        }}
        onSubmit={handleEditVendor}
        vendor={selectedVendor}
        formData={formData}
        formErrors={formErrors}
        handleInputChange={handleInputChange}
        resetForm={resetForm}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        vendor={vendorToDelete}
        onConfirm={handleDeleteVendor}
      />
    </div>
  );
}
