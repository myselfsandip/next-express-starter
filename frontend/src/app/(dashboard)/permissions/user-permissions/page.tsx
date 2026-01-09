//Here Fetch User or Employee or Whatever to Giver and See Permissions



// "use client";

// import { useState, useEffect } from "react";
// import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
// import { permissionsApi, UserPermissionsResponse } from "@/services/permissionsApi";
// import { employeeApi } from "@/services/employeeApi";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner";
// import { MODULES, ACTIONS, Module, Action, Scope } from "@/constants/permissions";
// import { UserPermission } from "@/lib/validations/permissions.validator";
// import { CustomLoader } from "@/components/custom-loader";
// import { Shield, Save, UserCog } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";

// const UserPermissionsPage = () => {
//     const queryClient = useQueryClient();
//     const [selectedUserId, setSelectedUserId] = useState<string>("");
//     const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);

//     const { data: employeesData, isLoading: employeesLoading } = useQuery({
//         queryKey: ["employees"],
//         queryFn: employeeApi.getAll,
//     });

//     const { data: permissionsData, isLoading: permissionsLoading } = useQuery({
//         queryKey: ["user-permissions", selectedUserId],
//         queryFn: () => permissionsApi.getUserPermissions(selectedUserId),
//         enabled: !!selectedUserId,
//     });

//     const saveMutation = useMutation({
//         mutationFn: (permissions: UserPermission[]) =>
//             permissionsApi.setUserPermissions(selectedUserId, permissions),
//         onSuccess: () => {
//             toast.success("User permissions updated successfully");
//             queryClient.invalidateQueries({
//                 queryKey: ["user-permissions", selectedUserId],
//             });
//         },
//         onError: (error: any) => {
//             toast.error(
//                 error?.response?.data?.message || "Failed to update permissions"
//             );
//         },
//     });

//     useEffect(() => {
//         if (permissionsData) {
//             setUserPermissions(permissionsData.overrides);
//         }
//     }, [permissionsData]);

//     const handlePermissionChange = (
//         module: Module,
//         action: Action,
//         type: "scope" | "denied",
//         value: Scope | boolean | "none"
//     ) => {
//         setUserPermissions((prev) => {
//             const existing = prev.find(
//                 (p) => p.module === module && p.action === action
//             );

//             if (value === "none" && type === "scope") {
//                 // Remove permission override
//                 return prev.filter(
//                     (p) => !(p.module === module && p.action === action)
//                 );
//             }

//             if (existing) {
//                 // Update existing
//                 return prev.map((p) =>
//                     p.module === module && p.action === action
//                         ? {
//                             ...p,
//                             ...(type === "scope"
//                                 ? { scope: value as Scope }
//                                 : { isDenied: value as boolean }),
//                         }
//                         : p
//                 );
//             } else {
//                 // Add new override
//                 return [
//                     ...prev,
//                     {
//                         module,
//                         action,
//                         scope: type === "scope" ? (value as Scope) : "own",
//                         isDenied: type === "denied" ? (value as boolean) : false,
//                     },
//                 ];
//             }
//         });
//     };

//     const savePermissions = () => {
//         saveMutation.mutate(userPermissions);
//     };

//     const moduleOptions = Object.entries(MODULES).map(([key, value]) => ({
//         value,
//         label: key.replace(/_/g, " ").toUpperCase(),
//     }));

//     const actionOptions = Object.entries(ACTIONS).map(([key, value]) => ({
//         value,
//         label: key.toUpperCase(),
//     }));

//     const selectedEmployee = employeesData?.find(
//         (emp) => emp.user.id === selectedUserId
//     );

//     if (employeesLoading) {
//         return <CustomLoader />;
//     }

//     return (
//         <div className="container py-6">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-6">
//                 <div>
//                     <h1 className="text-3xl font-bold tracking-tight">User Permissions</h1>
//                     <p className="text-muted-foreground">
//                         Manage custom permissions for individual employees
//                     </p>
//                 </div>
//             </div>

//             <div className="grid gap-6 md:grid-cols-2">
//                 {/* Employee Selector */}
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <UserCog className="h-5 w-5" />
//                             Select Employee
//                         </CardTitle>
//                         <p className="text-sm text-muted-foreground">
//                             Choose an employee to manage their custom permissions
//                         </p>
//                     </CardHeader>
//                     <CardContent>
//                         <Select value={selectedUserId} onValueChange={setSelectedUserId}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Select an employee" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {employeesData?.map((emp) => (
//                                     <SelectItem key={emp.user.id} value={emp.user.id}>
//                                         <div className="flex items-center gap-2">
//                                             <span>{emp.user.name}</span>
//                                             <span className="text-xs text-muted-foreground">
//                                                 ({emp.employee.employeeId})
//                                             </span>
//                                             <Badge variant="secondary" className="text-xs">
//                                                 {emp.user.role}
//                                             </Badge>
//                                         </div>
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </CardContent>
//                 </Card>

//                 {/* Save Button */}
//                 <Card>
//                     <CardContent className="pt-6">
//                         <Button
//                             onClick={savePermissions}
//                             className="w-full"
//                             disabled={!selectedUserId || saveMutation.isPending}
//                         >
//                             <Save className="mr-2 h-4 w-4" />
//                             {saveMutation.isPending
//                                 ? "Saving..."
//                                 : `Save ${selectedEmployee?.user.name || "User"} Permissions`}
//                         </Button>
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Selected Employee Info */}
//             {selectedEmployee && (
//                 <Card className="mt-6">
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <Shield className="h-5 w-5" />
//                             Employee Information
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="grid md:grid-cols-4 gap-4">
//                             <div>
//                                 <p className="text-sm text-muted-foreground">Name</p>
//                                 <p className="font-medium">{selectedEmployee.user.name}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-muted-foreground">Email</p>
//                                 <p className="font-medium">{selectedEmployee.user.email}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-muted-foreground">Employee ID</p>
//                                 <p className="font-medium">
//                                     {selectedEmployee.employee.employeeId}
//                                 </p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-muted-foreground">Role</p>
//                                 <Badge variant="secondary">{selectedEmployee.user.role}</Badge>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Effective Permissions Summary */}
//             {permissionsData && selectedEmployee && (
//                 <Card className="mt-6">
//                     <CardHeader>
//                         <CardTitle>Effective Permissions Summary</CardTitle>
//                         <p className="text-sm text-muted-foreground">
//                             {permissionsData.effective.length} total permissions active •{" "}
//                             {permissionsData.overrides.length} custom overrides
//                         </p>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="flex flex-wrap gap-2">
//                             {permissionsData.effective.map((perm, idx) => {
//                                 const isOverride = permissionsData.overrides.some(
//                                     (o) =>
//                                         o.module === perm.module && o.action === perm.action
//                                 );
//                                 return (
//                                     <Badge
//                                         key={idx}
//                                         variant={isOverride ? "default" : "outline"}
//                                     >
//                                         {perm.module}:{perm.action} ({perm.scope})
//                                         {isOverride && " ⭐"}
//                                     </Badge>
//                                 );
//                             })}
//                         </div>
//                         <p className="text-xs text-muted-foreground mt-2">
//                             ⭐ = Custom override
//                         </p>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Permissions Matrix */}
//             {selectedEmployee && (
//                 <Card className="mt-6">
//                     <CardHeader>
//                         <div>
//                             <CardTitle>Permission Overrides</CardTitle>
//                             <p className="text-sm text-muted-foreground">
//                                 Override role-based permissions for {selectedEmployee.user.name}.
//                                 Select "None" to use role defaults.
//                             </p>
//                         </div>
//                     </CardHeader>
//                     <CardContent>
//                         {permissionsLoading ? (
//                             <div className="flex justify-center py-8">
//                                 <div className="text-muted-foreground">
//                                     Loading permissions...
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 <table className="w-full">
//                                     <thead>
//                                         <tr className="border-b bg-muted/50">
//                                             <th className="text-left p-4 font-semibold">
//                                                 Module
//                                             </th>
//                                             {actionOptions.map((action) => (
//                                                 <th
//                                                     key={action.value}
//                                                     className="text-left p-4 font-semibold"
//                                                 >
//                                                     {action.label}
//                                                 </th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {moduleOptions.map((module) => (
//                                             <tr
//                                                 key={module.value}
//                                                 className="border-b last:border-b-0 hover:bg-muted/50"
//                                             >
//                                                 <td className="p-4 font-medium">
//                                                     {module.label}
//                                                 </td>
//                                                 {actionOptions.map((action) => {
//                                                     const permission = userPermissions.find(
//                                                         (p) =>
//                                                             p.module === module.value &&
//                                                             p.action === action.value
//                                                     );
//                                                     const rolePermission =
//                                                         permissionsData?.effective.find(
//                                                             (p) =>
//                                                                 p.module === module.value &&
//                                                                 p.action === action.value
//                                                         );

//                                                     return (
//                                                         <td key={action.value} className="p-4">
//                                                             <div className="space-y-2">
//                                                                 <Select
//                                                                     value={
//                                                                         permission?.scope || "none"
//                                                                     }
//                                                                     onValueChange={(scope) =>
//                                                                         handlePermissionChange(
//                                                                             module.value,
//                                                                             action.value,
//                                                                             "scope",
//                                                                             scope as Scope | "none"
//                                                                         )
//                                                                     }
//                                                                 >
//                                                                     <SelectTrigger className="w-32">
//                                                                         <SelectValue placeholder="None" />
//                                                                     </SelectTrigger>
//                                                                     <SelectContent>
//                                                                         <SelectItem value="none">
//                                                                             None
//                                                                             {rolePermission && (
//                                                                                 <span className="text-xs text-muted-foreground ml-1">
//                                                                                     (Role:{" "}
//                                                                                     {
//                                                                                         rolePermission.scope
//                                                                                     }
//                                                                                     )
//                                                                                 </span>
//                                                                             )}
//                                                                         </SelectItem>
//                                                                         <SelectItem value="global">
//                                                                             Global
//                                                                         </SelectItem>
//                                                                         <SelectItem value="own">
//                                                                             Own
//                                                                         </SelectItem>
//                                                                     </SelectContent>
//                                                                 </Select>
//                                                                 {permission && (
//                                                                     <div className="flex items-center gap-2">
//                                                                         <Checkbox
//                                                                             checked={
//                                                                                 permission.isDenied
//                                                                             }
//                                                                             onCheckedChange={(
//                                                                                 checked
//                                                                             ) =>
//                                                                                 handlePermissionChange(
//                                                                                     module.value,
//                                                                                     action.value,
//                                                                                     "denied",
//                                                                                     checked as boolean
//                                                                                 )
//                                                                             }
//                                                                         />
//                                                                         <span className="text-xs text-muted-foreground">
//                                                                             Deny
//                                                                         </span>
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         </td>
//                                                     );
//                                                 })}
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>
//             )}
//         </div>
//     );
// };

// export default UserPermissionsPage;



const UserPermissionsPage = () => {
    return (
        <div>UserPermissionsPage</div>
    )
}

export default UserPermissionsPage