import { createRoleSchemaType, updateRoleSchemaType } from "../lib/validations/roles.validator";
import apiClient from "./apiClient";

export const rolesApi = {
    getAllRoles: async () => {
        const response = await apiClient.get(`/api/v1/roles`);
        return response.data.data;
    },

    getRoleById: async (roleId: string) => {
        const response = await apiClient.get(`/api/v1/roles/${roleId}`);
        return response.data.data;
    },

    createRole: async (payload: createRoleSchemaType) => {
        const response = await apiClient.post(`/api/v1/roles/`, payload);
        return response.data.data;
    },

    updateRole: async (payload: updateRoleSchemaType, roleId: string) => {
        const response = await apiClient.patch(`/api/v1/roles/${roleId}`, payload);
        return response.data.data;
    },
};
