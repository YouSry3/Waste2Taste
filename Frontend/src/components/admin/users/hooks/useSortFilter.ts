import { useState, useMemo } from "react";
import { User, SortField, SortOrder } from "../types";
import { filterUsers, sortUsers } from "../utils/helpers";

export const useSortFilter = (users: User[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = filterUsers(users, searchTerm, filterStatus);
    return sortUsers(filtered, sortBy, sortOrder);
  }, [users, searchTerm, filterStatus, sortBy, sortOrder]);

  return {
    searchTerm,
    filterStatus,
    sortBy,
    sortOrder,
    filteredAndSortedUsers,
    setSearchTerm,
    setFilterStatus,
    toggleSort,
  };
};
