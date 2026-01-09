"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pen, Trash, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { rolesApi } from "@/services/rolesApi";
import { useConfirm } from "@/hooks/useConfirm";
import { CreateRoleDialog } from "./create-role-dialog";
import { EditRoleDialog } from "./edit-role-dialog";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface Role {
    id: string;
    name: string;
    key: string;
    description?: string;
    isSystem?: boolean;
    isActive?: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function RolesPage() {
    const queryClient = useQueryClient();
    const { ConfirmDialog, confirm } = useConfirm();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const { data: roles = [], isLoading } = useQuery({
        queryKey: ["roles"],
        queryFn: rolesApi.getAllRoles,
    });

    // const deleteMutation = useMutation({
    //     mutationFn: async (roleId: string) => {
    //         const response = await fetch(`/api/v1/roles/${roleId}`, {
    //             method: "DELETE",
    //         });
    //         if (!response.ok) throw new Error("Failed to delete role");
    //         return response.json();
    //     },
    //     onSuccess: () => {
    //         toast.success("Role deleted successfully");
    //         queryClient.invalidateQueries({ queryKey: ["roles"] });
    //     },
    //     onError: (error: any) => {
    //         toast.error(error?.message || "Failed to delete role");
    //     },
    // });

    const handleEdit = useCallback((role: Role) => {
        setSelectedRole(role);
        setEditDialogOpen(true);
    }, []);

    // const handleDelete = useCallback(
    //     async (role: Role) => {
    //         if (role.isSystem) {
    //             toast.error("Cannot delete system roles");
    //             return;
    //         }

    //         const confirmed = await confirm({
    //             title: "Delete Role",
    //             description: `Are you sure you want to delete "${role.name}"? This action cannot be undone.`,
    //             confirmText: "Delete",
    //             variant: "destructive",
    //         });

    //         if (!confirmed) return;

    //         deleteMutation.mutate(role.id);
    //     },
    //     [confirm, deleteMutation]
    // );

    const columns: ColumnDef<Role>[] = useMemo(
        () => [
            {
                id: "name",
                header: "Role Name",
                accessorKey: "name",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{row.original.name}</span>
                    </div>
                ),
            },
            {
                id: "key",
                header: "Key",
                accessorKey: "key",
                cell: ({ row }) => (
                    <Badge variant="outline" className="font-mono">
                        {row.original.key}
                    </Badge>
                ),
            },
            {
                id: "description",
                header: "Description",
                accessorKey: "description",
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {row.original.description || "—"}
                    </span>
                ),
            },
            {
                id: "status",
                header: "Status",
                cell: ({ row }) => {
                    const isSystem = row.original.isSystem;
                    const isActive = row.original.isActive;
                    return (
                        <div className="flex gap-2">
                            {isSystem && <Badge variant="secondary">System</Badge>}
                            {isActive !== undefined && (
                                <Badge variant={isActive ? "default" : "destructive"}>
                                    {isActive ? "Active" : "Inactive"}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    const role = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => handleEdit(role)}
                                    disabled={role.isSystem}
                                >
                                    <Pen className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem
                                    onClick={() => handleDelete(role)}
                                    disabled={role.isSystem}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem> */}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [handleEdit]
    );

    return (
        <div className="container py-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
                    <p className="text-muted-foreground">
                        Manage user roles and permissions
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Role
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={roles}
                isLoading={isLoading}
                filterKey="name"
            />

            <CreateRoleDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />

            <EditRoleDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                role={selectedRole}
            />

            <ConfirmDialog />
        </div>
    );
}
