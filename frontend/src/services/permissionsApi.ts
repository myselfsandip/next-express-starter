import apiClient from "./apiClient";
import { RolePermissions, UserPermission } from "@/lib/validations/permissions.validator";

export interface UserPermissionsResponse {
  overrides: UserPermission[];
  effective: Array<{
    module: string;
    action: string;
    scope: string;
  }>;
}

export const permissionsApi = {
  getRolePermissions: async (roleId: string): Promise<RolePermissions[]> => {
    const response = await apiClient.get(`/api/v1/permissions/roles/${roleId}`);
    return response.data.data;
  },

  upsertRolePermissions: async (roleId: string, permissions: RolePermissions[]): Promise<RolePermissions[]> => {
    const response = await apiClient.put(`/api/v1/permissions/roles/${roleId}`, { permissions });
    return response.data.data;
  },

  // User permissions
  getUserPermissions: async (userId: string): Promise<UserPermissionsResponse> => {
    const response = await apiClient.get(`/api/v1/permissions/users/${userId}`);
    return response.data.data;
  },

  setUserPermissions: async (userId: string, permissions: UserPermission[]): Promise<UserPermission[]> => {
    const response = await apiClient.put(`/api/v1/permissions/users/${userId}`, { permissions });
    return response.data.data;
  },
};
