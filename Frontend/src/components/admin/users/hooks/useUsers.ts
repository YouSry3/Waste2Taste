import { useState, useCallback, useEffect } from "react"; // Add useEffect
import toast from "react-hot-toast";
import { User, UserFormData } from "../types";
import { usersService } from "../api/users.service";
import { initialUsers } from "../utils/constants"; // Import mock data

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>(initialUsers); // Initialize with mock data
  const [isLoading, setIsLoading] = useState(false);

  // Add useEffect to load users on mount (optional)
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await usersService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
      // Keep the initial mock data if API fails
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

  const updateUser = useCallback(async (id: number, formData: UserFormData) => {
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

  const deleteUsers = useCallback(async (userIds: number[]) => {
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
