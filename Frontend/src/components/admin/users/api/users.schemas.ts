/*
AI AGENT PROMPT:
This file contains validation schemas for user data using Yup.
Yup schemas provide runtime validation with TypeScript support.
*/

import * as yup from "yup";

// Yup validation schemas
export const createUserSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(
      /^\(\d{3}\)\s\d{3}-\d{4}$/,
      "Phone must be in format (555) 123-4567",
    )
    .required("Phone is required"),
  orders: yup
    .number()
    .min(0, "Orders must be positive")
    .required("Orders is required"),
  totalSpent: yup
    .string()
    .matches(/^\$\d+(\.\d{2})?$/, "Total spent must be in format $0.00")
    .required("Total spent is required"),
  status: yup
    .mixed<"Active" | "Inactive">()
    .oneOf(["Active", "Inactive"], "Status must be either Active or Inactive")
    .required("Status is required"),
  joined: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Joined date must be in format YYYY-MM-DD")
    .required("Joined date is required"),
  lastOrder: yup
    .string()
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Last order date must be in format YYYY-MM-DD",
    )
    .required("Last order date is required"),
});

export const updateUserSchema = createUserSchema.partial();

export const bulkActionSchema = yup.object({
  action: yup
    .mixed<"activate" | "deactivate" | "delete">()
    .oneOf(["activate", "deactivate", "delete"], "Invalid action")
    .required("Action is required"),
  userIds: yup
    .array()
    .of(yup.number().required())
    .min(1, "At least one user must be selected")
    .required("User IDs are required"),
});

export const usersQuerySchema = yup.object({
  search: yup.string().optional(),
  status: yup
    .mixed<"all" | "active" | "inactive">()
    .oneOf(["all", "active", "inactive"], "Invalid status filter")
    .optional(),
  sortBy: yup
    .mixed<"name" | "orders" | "totalSpent" | "lastOrder">()
    .oneOf(["name", "orders", "totalSpent", "lastOrder"], "Invalid sort field")
    .optional(),
  sortOrder: yup
    .mixed<"asc" | "desc">()
    .oneOf(["asc", "desc"], "Invalid sort order")
    .optional(),
  page: yup.number().min(1, "Page must be at least 1").optional(),
  limit: yup
    .number()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .optional(),
});

// TypeScript types inferred from Yup schemas
export type CreateUserInput = yup.InferType<typeof createUserSchema>;
export type UpdateUserInput = yup.InferType<typeof updateUserSchema>;
export type BulkActionInput = yup.InferType<typeof bulkActionSchema>;
export type UsersQueryInput = yup.InferType<typeof usersQuerySchema>;

// Helper function to validate data against a schema
export const validateSchema = async <T>(
  schema: yup.AnySchema,
  data: unknown,
): Promise<{ success: boolean; data?: T; errors?: string[] }> => {
  try {
    const validatedData = await schema.validate(data, { abortEarly: false });
    return { success: true, data: validatedData as T };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        success: false,
        errors: error.errors,
      };
    }
    return {
      success: false,
      errors: ["Unknown validation error"],
    };
  }
};

// Convenience validation functions
export const validateCreateUser = (data: unknown) =>
  validateSchema<CreateUserInput>(createUserSchema, data);

export const validateUpdateUser = (data: unknown) =>
  validateSchema<UpdateUserInput>(updateUserSchema, data);

export const validateBulkAction = (data: unknown) =>
  validateSchema<BulkActionInput>(bulkActionSchema, data);

export const validateUsersQuery = (data: unknown) =>
  validateSchema<UsersQueryInput>(usersQuerySchema, data);
