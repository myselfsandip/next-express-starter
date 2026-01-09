import { Action, Module, Scope } from "@/constants/permissions";

export interface User {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: string;
}

export interface Permission {
    module: Module;
    action: Action;
    scope: Scope;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

export interface ProfileResponse {
    user: User;
    permissions?: Permission[];
}