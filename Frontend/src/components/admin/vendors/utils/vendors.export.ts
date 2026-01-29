import { Vendor } from "../api/vendors.types";

export const exportVendorsToCSV = (
  vendors: Vendor[],
  filename: string = "vendors",
): void => {
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

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute(
    "download",
    `${filename}-${new Date().toISOString().split("T")[0]}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const exportVendorsToJSON = (
  vendors: Vendor[],
  filename: string = "vendors",
): void => {
  const dataStr = JSON.stringify(vendors, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute(
    "download",
    `${filename}-${new Date().toISOString().split("T")[0]}.json`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
