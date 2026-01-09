"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { permissionsApi } from "@/services/permissionsApi";
import { rolesApi } from "@/services/rolesApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { STATIC_ROLES, MODULES, ACTIONS, SCOPES, Module, Action, Scope } from "@/constants/permissions";
import { Role } from "@/types/roles";
import { RolePermissions } from "@/lib/validations/permissions.validator";
import { CustomLoader } from "@/components/custom-loader";


const RolesPage = () => {
    const queryClient = useQueryClient();
    const [selectedRoleId, setSelectedRoleId] = useState<string>("");
    const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useQuery({
        queryKey: ["roles"],
        queryFn: rolesApi.getAllRoles,
    });

    const { data: currentPermissions, isLoading: permissionsLoading } = useQuery({
        queryKey: ["role-permissions", selectedRoleId],
        queryFn: () => permissionsApi.getRolePermissions(selectedRoleId),
        enabled: !!selectedRoleId,
    });

    useEffect(() => {
        if (rolesData) {
            setRoles(rolesData);
        }
    }, [rolesData]);

    useEffect(() => {
        if (currentPermissions) {
            setRolePermissions(currentPermissions);
        }
    }, [currentPermissions]);


    const handleScopeChange = (
        module: Module,
        action: Action,
        scope: Scope | "none"
    ) => {
        setRolePermissions(prev => {
            if (scope === "none") {
                return prev.filter(perm =>
                    !(perm.module === module && perm.action === action)
                ) as RolePermissions[];
            }

            const exists = prev.some(perm =>
                perm.module === module && perm.action === action
            );

            if (exists) {
                return prev.map(perm =>
                    perm.module === module && perm.action === action
                        ? { ...perm, scope: scope as Scope }
                        : perm
                ) as RolePermissions[];
            } else {
                return [...prev, {
                    module,
                    action,
                    scope: scope as Scope
                }] as RolePermissions[];
            }
        });
    };


    const savePermissions = async () => {
        try {
            await permissionsApi.upsertRolePermissions(selectedRoleId, rolePermissions);
            toast.success("Role permissions updated successfully");
            queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update permissions");
        }
    };

    const moduleOptions = Object.entries(MODULES).map(([key, value]) => ({
        value,
        label: key.replace(/_/g, " ").toUpperCase(),
    }));

    const actionOptions = Object.entries(ACTIONS).map(([key, value]) => ({
        value,
        label: key.toUpperCase(),
    }));

    const availableRoles = roles.filter(role =>
        role.key !== STATIC_ROLES.ADMIN && !role.isSystem
    );

    const selectedRole = roles.find(role => role.id === selectedRoleId);

    if (rolesLoading) {
        return (
            <CustomLoader />
        );
    }

    if (rolesError) {
        return (
            <div className="container py-12">
                <div className="text-center text-destructive">
                    Failed to load roles
                </div>
            </div>
        );
    }

    return (
        <div className="container py-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
                    <p className="text-muted-foreground">Manage role-based permissions for your system</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Role Selector */}
                <Card>
                    <CardHeader>
                        <CardTitle>Select Role</CardTitle>
                        <p className="text-sm text-muted-foreground">Choose a role to manage permissions</p>
                    </CardHeader>
                    <CardContent>
                        <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableRoles.map(role => {
                                    if (role.key === STATIC_ROLES.ADMIN) return null;
                                    return (
                                        <SelectItem key={role.id} value={role.id}>
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="capitalize">
                                                        {role.name}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {role.key}
                                                    </span>
                                                </div>
                                                {role.isSystem && (
                                                    <Badge variant="outline" className="text-xs">
                                                        System
                                                    </Badge>
                                                )}
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <Card>
                    <CardContent className="pt-6">
                        <Button
                            onClick={savePermissions}
                            className="w-full"
                            disabled={!selectedRoleId || permissionsLoading}
                        >
                            {permissionsLoading
                                ? "Saving..."
                                : `Save ${selectedRole?.name || ""} Permissions`
                            }
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Permissions Matrix */}
            {selectedRole && (
                <Card className="mt-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{selectedRole.name} Permissions</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Key: <code className="bg-muted px-1 rounded">{selectedRole.key}</code> |
                                    ID: <code className="bg-muted px-1 rounded">{selectedRole.id}</code>
                                </p>
                            </div>
                            {selectedRole.isSystem ? (
                                <Badge variant="secondary">System Role</Badge>
                            ) : (
                                <Badge variant="outline">Custom Role</Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {permissionsLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="text-muted-foreground">Loading permissions...</div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="text-left p-4 font-semibold">Module</th>
                                            {actionOptions.map(action => (
                                                <th key={action.value} className="text-left p-4 font-semibold">
                                                    {action.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {moduleOptions.map((module) => (
                                            <tr key={module.value} className="border-b last:border-b-0 hover:bg-muted/50">
                                                <td className="p-4 font-medium">{module.label}</td>
                                                {actionOptions.map((action) => {
                                                    const permission = rolePermissions.find(
                                                        p => p.module === module.value && p.action === action.value
                                                    );
                                                    return (
                                                        <td key={action.value} className="p-4">
                                                            <Select
                                                                value={permission?.scope || "none"}
                                                                onValueChange={(scope) => handleScopeChange(
                                                                    module.value,
                                                                    action.value,
                                                                    scope as "global" | "own" | "none"
                                                                )}
                                                            >
                                                                <SelectTrigger className="w-28">
                                                                    <SelectValue placeholder="None" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="none">None</SelectItem>
                                                                    <SelectItem value="global">Global</SelectItem>
                                                                    <SelectItem value="own">Own</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default RolesPage;
