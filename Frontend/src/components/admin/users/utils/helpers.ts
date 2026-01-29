export const generateCSV = (users: any[]): string => {
  const headers = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Orders",
    "Total Spent",
    "Status",
    "Joined",
    "Last Order",
  ];

  const csvData = users.map((u) => [
    u.id,
    u.name,
    u.email,
    u.phone,
    u.orders,
    u.totalSpent,
    u.status,
    u.joined,
    u.lastOrder,
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
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status.toLowerCase() === filterStatus;
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
      case "name":
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case "orders":
        aVal = a.orders;
        bVal = b.orders;
        break;
      case "totalSpent":
        aVal = parseFloat(a.totalSpent.replace(/[$,]/g, ""));
        bVal = parseFloat(b.totalSpent.replace(/[$,]/g, ""));
        break;
      case "lastOrder":
        aVal = a.lastOrder === "N/A" ? 0 : new Date(a.lastOrder).getTime();
        bVal = b.lastOrder === "N/A" ? 0 : new Date(b.lastOrder).getTime();
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
