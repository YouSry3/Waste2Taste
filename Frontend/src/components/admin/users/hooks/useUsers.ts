import { useState, useCallback, useEffect } from "react"; // Add useEffect
import toast from "react-hot-toast";
import { User, UserFormData, UsersQueryParams } from "../types";
import { usersService } from "../api/users.service";

export const useUsers = (params?: UsersQueryParams) => {
  const [users, setUsers] = useState<User[]>([]); // Start with empty array instead of mock data
  const [isLoading, setIsLoading] = useState(false);

  // Add useEffect to load users on mount (optional)
  useEffect(() => {
    loadUsers(params);
  }, [params?.search, params?.status, params?.sortBy, params?.sortOrder, params?.page, params?.pageSize]);

  const loadUsers = useCallback(async (queryParams?: UsersQueryParams) => {
    try {
      setIsLoading(true);
      const data = await usersService.getUsers(queryParams);
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users from API. Check console for details.");
      setUsers([]); // Clear users on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ... rest of the code remains the same
  const addUser = useCallback(async (formData: UserFormData) => {
    try {
      setIsLoading(true);
      const newUser = await usersService.createUser(formData);
      setUsers((prev) => [...prev, newUser]);
      toast.success(`${formData.name} added successfully!`);
    } catch (error) {
      toast.error("Failed to add user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, formData: UserFormData) => {
    try {
      setIsLoading(true);
      const updatedUser = await usersService.updateUser(id, formData);
      setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));
      toast.success(`${formData.name} updated successfully!`);
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleStatus = useCallback(async (user: User) => {
    try {
      setIsLoading(true);
      const updatedUser = await usersService.toggleUserStatus(user.id);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
      toast.success(`${user.name} is now ${updatedUser.status}`);
    } catch (error) {
      toast.error("Failed to update user status");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUsers = useCallback(async (userIds: string[]) => {
    try {
      setIsLoading(true);
      await Promise.all(userIds.map((id) => usersService.deleteUser(id)));
      setUsers((prev) => prev.filter((u) => !userIds.includes(u.id)));
      toast.success(`${userIds.length} users deleted`);
    } catch (error) {
      toast.error("Failed to delete users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    users,
    isLoading,
    loadUsers,
    addUser,
    updateUser,
    toggleStatus,
    deleteUsers,
  };
};
