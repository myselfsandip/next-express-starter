"use client"

import { Action, Module } from '@/constants/permissions';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
    requiredPermission?: { module: Module; action: Action };
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole,
    requiredPermission
}) => {
    const { isAuthenticated, loading, hasRole, checkPermission } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }

        if (!loading && isAuthenticated && requiredRole && !hasRole(requiredRole)) {
            router.push('/unauthorized');
        }

        if (!loading && isAuthenticated && requiredPermission) {
            const { allowed } = checkPermission(
                requiredPermission.module,
                requiredPermission.action
            );
            if (!allowed) {
                router.push('/unauthorized');
            }
        }
    }, [loading, isAuthenticated, requiredRole, requiredPermission]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};
