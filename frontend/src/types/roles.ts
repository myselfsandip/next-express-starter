import { Scope } from "@/constants/permissions";

export interface Role {
    id: string;
    name: string;
    key: string;
    description?: string;
    isSystem?: boolean;
    isActive?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RolePermission {
    module: string;
    action: string;
    scope: Scope;
}