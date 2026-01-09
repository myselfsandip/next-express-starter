"use client";

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
    createRoleSchema,
    createRoleSchemaType,
} from "@/lib/validations/roles.validator";

interface CreateRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateRoleDialog({ open, onOpenChange }: CreateRoleDialogProps) {
    const queryClient = useQueryClient();

    const form = useForm<createRoleSchemaType>({
        resolver: zodResolver(createRoleSchema),
        defaultValues: {
            name: "",
            key: "",
            description: "",
        },
    });

    const createMutation = useMutation({
        mutationFn: rolesApi.createRole,
        onSuccess: () => {
            toast.success("Role created successfully");
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            form.reset();
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to create role");
        },
    });

    const onSubmit = (data: createRoleSchemaType) => {
        createMutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Role</DialogTitle>
                    <DialogDescription>
                        Add a new role to your system. Role keys should be unique and
                        uppercase.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g., Manager"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="key"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role Key *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g., MANAGER"
                                            className="font-mono"
                                            onChange={(e) => {
                                                // Auto-convert to uppercase
                                                field.onChange(
                                                    e.target.value.toUpperCase().replace(/\s/g, "_")
                                                );
                                            }}
                                        />
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
                                    <FormLabel>Description *</FormLabel>
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
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending ? "Creating..." : "Create Role"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
