import { Vendor, FilterState } from "../api/vendors.types";

export const filterAndSortVendors = (
  vendors: Vendor[],
  filters: FilterState,
): Vendor[] => {
  const {
    searchTerm,
    filterType,
    filterCategory,
    filterStatus,
    sortBy,
    sortOrder,
  } = filters;

  return vendors
    .filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === "all" || vendor.type === filterType;
      const matchesCategory =
        filterCategory === "all" || vendor.category === filterCategory;
      const matchesStatus =
        filterStatus === "all" || vendor.status === filterStatus;

      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortBy) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "revenue":
          aVal = parseFloat(a.revenue.replace(/[$,]/g, ""));
          bVal = parseFloat(b.revenue.replace(/[$,]/g, ""));
          break;
        case "rating":
          aVal = a.rating;
          bVal = b.rating;
          break;
        case "listings":
          aVal = a.listings;
          bVal = b.listings;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
};

export const getTopPerformers = (vendors: Vendor[]): Vendor[] => {
  const regularVendors = vendors.filter((v) => v.type === "Vendor");
  return [...regularVendors]
    .sort(
      (a, b) =>
        parseFloat(b.revenue.replace(/[$,]/g, "")) -
        parseFloat(a.revenue.replace(/[$,]/g, "")),
    )
    .slice(0, 3);
};

export const getVendorStats = (vendors: Vendor[]) => {
  const regularVendors = vendors.filter((v) => v.type === "Vendor");
  const ngoPartners = vendors.filter((v) => v.type === "NGO Partner");

  return {
    totalVendors: regularVendors.length,
    ngoPartners: ngoPartners.length,
    activeListings: vendors.reduce((sum, v) => sum + v.listings, 0),
    totalRevenue: vendors.reduce(
      (sum, v) => sum + parseFloat(v.revenue.replace(/[$,]/g, "")),
      0,
    ),
  };
};

export const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6)
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
};

export const exportToCSV = (vendors: Vendor[], filename: string) => {
  const headers = [
    "ID",
    "Name",
    "Type",
    "Category",
    "Contact",
    "Email",
    "Phone",
    "Address",
    "Listings",
    "Revenue",
    "Rating",
    "Status",
  ];

  const csvData = vendors.map((v) => [
    v.id,
    v.name,
    v.type,
    v.category,
    v.contact,
    v.email,
    v.phone,
    v.address,
    v.listings,
    v.revenue,
    v.rating,
    v.status,
  ]);

  const csv = [
    headers.join(","),
    ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
