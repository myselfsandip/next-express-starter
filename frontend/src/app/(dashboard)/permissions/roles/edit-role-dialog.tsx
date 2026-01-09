"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { rolesApi } from "@/services/rolesApi";
import {
    updateRoleSchema,
    updateRoleSchemaType,
} from "@/lib/validations/roles.validator";

interface Role {
    id: string;
    name: string;
    key: string;
    description?: string;
    isSystem?: boolean;
}

interface EditRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role | null;
}

export function EditRoleDialog({
    open,
    onOpenChange,
    role,
}: EditRoleDialogProps) {
    const queryClient = useQueryClient();

    const form = useForm<updateRoleSchemaType>({
        resolver: zodResolver(updateRoleSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (role) {
            form.reset({
                name: role.name,
                description: role.description || "",
            });
        }
    }, [role, form]);

    const updateMutation = useMutation({
        mutationFn: (data: updateRoleSchemaType) =>
            rolesApi.updateRole(data, role!.id),
        onSuccess: () => {
            toast.success("Role updated successfully");
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update role");
        },
    });

    const onSubmit = (data: updateRoleSchemaType) => {
        updateMutation.mutate(data);
    };

    if (!role) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Role</DialogTitle>
                    <DialogDescription>
                        Update the role information. Role key cannot be changed.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormItem>
                            <FormLabel>Role Key</FormLabel>
                            <Input
                                value={role.key}
                                disabled
                                className="font-mono bg-muted"
                            />
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g., Manager" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Describe the role's responsibilities..."
                                            rows={3}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? "Updating..." : "Update Role"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
