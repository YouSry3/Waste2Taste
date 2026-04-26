import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { UsersOverview } from "../types";
import { usersService } from "../api/users.service";

const DEFAULT_OVERVIEW: UsersOverview = {
  totalUsers: 0,
  activeUsers: 0,
  totalOrders: 0,
  topSpenders: [],
};

export const useUsersOverview = () => {
  const [overview, setOverview] = useState<UsersOverview>(DEFAULT_OVERVIEW);
  const [isLoading, setIsLoading] = useState(true);

  const loadOverview = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await usersService.getUsersOverview();
      setOverview(data);
    } catch (error) {
      toast.error("Failed to load users overview");
      // Keep default values if API fails
      setOverview(DEFAULT_OVERVIEW);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  return {
    overview,
    isLoading,
    refetch: loadOverview,
  };
};