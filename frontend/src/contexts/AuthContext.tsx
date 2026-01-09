"use client"

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { authApi } from "@/services/authApi";
import { User, Permission } from "@/types/auth";
import { toast } from "sonner";
import { Action, Module, Scope, SCOPES, STATIC_ROLES } from "@/constants/permissions";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    permissions: Permission[];
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkPermission: (module: Module, action: Action) => { allowed: boolean; scope: Scope | null };
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [permissions, setPermissions] = useState<Permission[]>([]);

    async function fetchUserProfile() {
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        if (!accessToken && !refreshToken) {
            setLoading(false);
            return;
        }

        try {
            const profileData = await authApi.getProfile();
            setUser(profileData.user);
            setPermissions(profileData.permissions || []);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Profile fetch error:", error);
            Cookies.remove('accessToken', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string, password: string) {
        try {
            const data = await authApi.login(email, password);

            Cookies.set('accessToken', data.accessToken, {
                expires: 1 / 24, // 1 hour
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
            });

            Cookies.set('refreshToken', data.refreshToken, {
                expires: 7, // 7 days
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
            });

            setUser(data.user);
            await fetchUserProfile();
            setIsAuthenticated(true);

            toast.success("Login successful!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login failed");
            throw error;
        }
    }

    function logout() {
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });

        setUser(null);
        setPermissions([]);
        setIsAuthenticated(false);

        toast.success("Logged out successfully");
    }

    function checkPermission(module: Module, action: Action): { allowed: boolean; scope: Scope | null } {
        if (!user) return { allowed: false, scope: null };

        if (user.role === STATIC_ROLES.ADMIN) {
            return { allowed: true, scope: SCOPES.GLOBAL };
        }

        const permission = permissions.find(
            p => p.module === module && p.action === action
        );

        if (permission) {
            return { allowed: true, scope: permission.scope };
        }

        return { allowed: false, scope: null };
    }

    function hasRole(role: string): boolean {
        return user?.role === role;
    }

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            permissions,
            login,
            logout,
            checkPermission,
            hasRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
