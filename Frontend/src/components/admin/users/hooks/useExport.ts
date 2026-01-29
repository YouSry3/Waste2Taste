import { useCallback } from "react";
import toast from "react-hot-toast";
import { User } from "../types";
import { generateCSV, downloadCSV } from "../utils/helpers";

export const useExport = () => {
  const handleExportCSV = useCallback((users: User[]) => {
    try {
      const csv = generateCSV(users);
      const filename = `users-${new Date().toISOString().split("T")[0]}.csv`;
      downloadCSV(csv, filename);
      toast.success("User list exported successfully!");
    } catch (error) {
      toast.error("Failed to export users");
    }
  }, []);

  return {
    handleExportCSV,
  };
};
