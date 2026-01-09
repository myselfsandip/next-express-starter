"use client"

import { Action, Module } from '@/constants/permissions';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface PermissionGateProps {
    children: ReactNode;
    module: Module;
    action: Action;
    fallback?: ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
    children,
    module,
    action,
    fallback = null
}) => {
    const { checkPermission } = useAuth();
    const { allowed } = checkPermission(module, action);

    if (!allowed) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
