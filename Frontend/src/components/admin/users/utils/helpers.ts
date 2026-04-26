export const generateCSV = (users: any[]): string => {
  const headers = [
    "ID",
    "Full Name",
    "Email",
    "Phone Number",
    "Orders Count",
    "Total Spent",
    "Status",
    "Joined At",
    "Last Order Date",
  ];

  const csvData = users.map((u) => [
    u?.id || "",
    u?.fullName || "",
    u?.email || "",
    u?.phoneNumber || "",
    u?.ordersCount || 0,
    u?.totalSpent || 0,
    u?.isActive ? "Active" : "Inactive",
    u?.joinedAt || "",
    u?.lastOrderDate || "Never",
  ]);

  const csv = [
    headers.join(","),
    ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csv;
};

export const downloadCSV = (csv: string, filename: string): void => {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const filterUsers = (
  users: any[],
  searchTerm: string,
  filterStatus: string,
): any[] => {
  return users.filter((user) => {
    // Add null checks to prevent errors when fields are undefined
    const fullName = user?.fullName?.toLowerCase() || "";
    const email = user?.email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      fullName.includes(search) ||
      email.includes(search);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user?.isActive) ||
      (filterStatus === "inactive" && !user?.isActive);

    return matchesSearch && matchesStatus;
  });
};

export const sortUsers = (
  users: any[],
  sortBy: string,
  sortOrder: string,
): any[] => {
  return [...users].sort((a, b) => {
    let aVal: any, bVal: any;

    switch (sortBy) {
      case "fullName":
        aVal = a?.fullName?.toLowerCase() || "";
        bVal = b?.fullName?.toLowerCase() || "";
        break;
      case "ordersCount":
        aVal = a?.ordersCount || 0;
        bVal = b?.ordersCount || 0;
        break;
      case "totalSpent":
        aVal = a?.totalSpent || 0;
        bVal = b?.totalSpent || 0;
        break;
      case "lastOrderDate":
        aVal = a?.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0;
        bVal = b?.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0;
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
