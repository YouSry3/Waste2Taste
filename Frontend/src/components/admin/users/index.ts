// Barrel exports for clean imports
export { UsersView } from "./UsersView";
export type {
  User,
  UserFormData,
  SortField,
  SortOrder,
  UserStatus,
} from "./types";

// Export API
export { usersApi } from "./api";
export type {
  CreateUserDto,
  UpdateUserDto,
  UserResponse,
  UsersQueryParams,
  BulkActionRequest,
} from "./api/users.types";

// Export hooks
export {
  useUsers,
  useUserForm,
  useBulkActions,
  useSortFilter,
  useExport,
} from "./hooks";

// Export components
export {
  UserTable,
  UserStats,
  UserFilters,
  BulkActions,
  TopSpenders,
  AddUserDialog,
  EditUserDialog,
  ViewUserDialog,
} from "./components";
