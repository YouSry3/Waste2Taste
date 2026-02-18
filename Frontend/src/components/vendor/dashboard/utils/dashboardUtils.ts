import { VendorOrder } from "../../types";

export const getSuggestedPrice = (name: string) => {
  if (name.includes("Surprise Bag")) return 15.0;
  if (name.includes("Pastry")) return 12.0;
  if (name.includes("Sandwich")) return 10.0;
  return 8.0;
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export const getStatusColor = (status: VendorOrder["status"]) => {
  switch (status) {
    case "Picked Up":
      return "bg-green-100 text-green-800 border-green-200";
    case "Ready for Pickup":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Pending Pickup":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "In Progress":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
