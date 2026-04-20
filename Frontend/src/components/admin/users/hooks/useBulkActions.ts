import { useState, useCallback } from "react";
import { User } from "../types";
import { usersService } from "../api/users.service";

interface BulkActionsProps {
  toggleStatus: (user: User) => void;
  deleteUsers: (userIds: number[]) => void;
}

export const useBulkActions = (
  users: User[],
  filteredUsers: User[],
  actions: BulkActionsProps,
) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

  const toggleUserSelection = useCallback((userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (isSelectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
    setIsSelectAll(!isSelectAll);
  }, [isSelectAll, filteredUsers]);

  const handleBulkAction = useCallback(
    async (action: "activate" | "deactivate" | "delete") => {
      setIsBulkActionLoading(true);

      try {
        await usersService.bulkAction({
          action,
          userIds: selectedUsers,
        });

        switch (action) {
          case "activate":
            selectedUsers.forEach((userId) => {
              const user = users.find((u) => u.id === userId);
              if (user && user.status === "Inactive") {
                actions.toggleStatus(user);
              }
            });
            break;
          case "deactivate":
            selectedUsers.forEach((userId) => {
              const user = users.find((u) => u.id === userId);
              if (user && user.status === "Active") {
                actions.toggleStatus(user);
              }
            });
            break;
          case "delete":
            actions.deleteUsers(selectedUsers);
            break;
        }

        setSelectedUsers([]);
        setIsSelectAll(false);
      } catch (error) {
        // Error is already handled by the service
      } finally {
        setIsBulkActionLoading(false);
      }
    },
    [selectedUsers, users, actions],
  );

  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
    setIsSelectAll(false);
  }, []);

  return {
    selectedUsers,
    isSelectAll,
    isBulkActionLoading,
    toggleUserSelection,
    toggleSelectAll,
    handleBulkAction,
    clearSelection,
  };
};
