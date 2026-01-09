"use client"

import {
    FileTextIcon,
    LayoutDashboard,
    Building2,
    Users,
    FileText,
    CreditCard,
    Wallet,
    Bell,
    CheckSquare,
    UserCog,
    BarChart3,
    Settings,
    ChevronDown,
    Receipt,
    FolderOpen,
    ClipboardList,
    UserLockIcon
} from "lucide-react";
import {
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    Sidebar,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import DashboardUserButton from "../dashboard/DashboardUserButton";
import { COMPANY_NAME } from "@/constants/info";
import { useAuth } from "@/contexts/AuthContext";
import { MODULES, ACTIONS, STATIC_ROLES, Action, Module } from "@/constants/permissions";

interface SubItem {
    label: string;
    href: string;
    action?: Action;
    module?: Module;
}

interface MenuItem {
    icon: any;
    label: string;
    href: string;
    module?: Module;
    adminOnly?: boolean;
    subItems?: SubItem[];
}

function DashboardSidebar() {
    const pathname = usePathname();
    const { user, hasRole, checkPermission } = useAuth();

    if (!user) return null;

    const isAdmin = hasRole(STATIC_ROLES.ADMIN);

    const mainFeatures: MenuItem[] = [
        {
            icon: LayoutDashboard,
            label: "Dashboard",
            href: "/dashboard",
            module: undefined, // Always visible
        },
        
        {
            icon: FolderOpen,
            label: "Documents",
            href: "/documents",
            module: MODULES.DOCUMENTS,
            subItems: [
                { label: "All Documents", href: "/documents", action: ACTIONS.READ },
                { label: "Property Docs", href: "/documents/properties", action: ACTIONS.READ },
                { label: "Tenant Docs", href: "/documents/tenants", action: ACTIONS.READ },
                { label: "Employee Docs", href: "/documents/employees", action: ACTIONS.READ },
                { label: "Expiring Docs", href: "/documents/expiring", action: ACTIONS.READ }
            ]
        },
        {
            icon: CheckSquare,
            label: "Tasks & Reminders",
            href: "/tasks",
            module: MODULES.TASKS,
            subItems: [
                { label: "All Tasks", href: "/tasks", action: ACTIONS.READ },
                { label: "Pending", href: "/tasks/pending", action: ACTIONS.READ },
                { label: "Overdue", href: "/tasks/overdue", action: ACTIONS.READ }
            ]
        },
        {
            icon: UserCog,
            label: "Employees",
            href: "/employees",
            module: MODULES.EMPLOYEES,
            subItems: [
                { label: "All Employees", href: "/employees", action: ACTIONS.READ },
                { label: "Add Employee", href: "/employees/create", action: ACTIONS.CREATE },
            ]
        },
        
        {
            icon: UserLockIcon,
            label: "Permissions",
            href: "/permissions",
            adminOnly: true,
            subItems: [
                { label: "Roles Management", href: "/permissions/roles" },
                { label: "Roles Permissions", href: "/permissions/roles-permissions" },
                { label: "User Permissions", href: "/permissions/user-permissions" },
            ]
        },
        {
            icon: Settings,
            label: "Settings",
            href: "/settings",
            module: undefined, // Always visible
            subItems: [
                { label: "General", href: "/settings/general" },
                { label: "Notifications", href: "/settings/notifications" },
                { label: "Payment Methods", href: "/settings/payments" }
            ]
        }
    ];

    // Filter main features
    const filteredFeatures = mainFeatures.filter((item) => {
        if (isAdmin) return true;                    // Admin sees everything
        if (item.adminOnly) return false;            // Non-admin can't see admin-only
        if (!item.module) return true;               // No module = always visible
        const { allowed } = checkPermission(item.module, ACTIONS.READ); // Check read permission
        return allowed;
    }).map((item) => {
        // Filter sub-items based on permissions
        if (item.subItems && item.subItems.length > 0) {
            const filteredSubItems = item.subItems.filter((subItem) => {
                if (isAdmin) return true; // Admin sees all sub-items
                if (!subItem.action) return true; // No action = always visible
                
                // Get module from subItem or fallback to parent item's module
                const module = subItem.module || item.module;
                if (!module) return true; // No module = always visible
                
                const { allowed } = checkPermission(module, subItem.action);
                return allowed;
            });

            // If no sub-items are visible, don't show the parent item
            if (filteredSubItems.length === 0 && !isAdmin) {
                return null;
            }

            return {
                ...item,
                subItems: filteredSubItems
            };
        }
        return item;
    }).filter(Boolean) as MenuItem[];

    return (
        <Sidebar className={cn(
            "border-r",
            "border-border/40",
            "bg-gradient-to-b from-background to-muted/20"
        )}>
            <SidebarHeader className="border-b border-border/40 py-4 px-2 bg-background/50 backdrop-blur-sm">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 group hover:bg-accent/50 transition-all rounded-xl"
                >
                    <div className="w-9 h-9 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-105 transition-all">
                        <Building2 className="w-5 h-5 text-gray-200" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                            {COMPANY_NAME}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium -mt-0.5">
                            {isAdmin ? "Admin Panel" : "Employee Panel"}
                        </span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-3 py-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1.5">
                            {filteredFeatures.map((item, idx) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                const hasSubItems = item.subItems && item.subItems.length > 0;

                                if (hasSubItems) {
                                    return (
                                        <Collapsible
                                            key={idx}
                                            defaultOpen={isActive}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        className={cn(
                                                            "h-11 px-3 rounded-xl transition-all duration-200",
                                                            "hover:bg-accent hover:text-accent-foreground",
                                                            isActive
                                                                ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-primary font-semibold shadow-sm border border-primary/20 dark:from-primary/20 dark:via-primary/10"
                                                                : "text-muted-foreground hover:shadow-sm"
                                                        )}
                                                    >
                                                        <item.icon className={cn(
                                                            "size-5 transition-all",
                                                            isActive ? "text-primary scale-110" : "text-muted-foreground"
                                                        )} />
                                                        <span className="text-sm flex-1">
                                                            {item.label}
                                                        </span>
                                                        <ChevronDown className={cn(
                                                            "size-4 transition-transform duration-200",
                                                            "group-data-[state=open]/collapsible:rotate-180"
                                                        )} />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub className="ml-4 mt-1 space-y-1">
                                                        {item.subItems!.map((subItem, subIdx) => {
                                                            const isSubActive = pathname === subItem.href;
                                                            return (
                                                                <SidebarMenuSubItem key={subIdx}>
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        isActive={isSubActive}
                                                                        className={cn(
                                                                            "rounded-lg transition-all duration-200",
                                                                            isSubActive
                                                                                ? "bg-primary/10 text-primary font-medium"
                                                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                                        )}
                                                                    >
                                                                        <Link href={subItem.href}>
                                                                            <span className="text-xs">
                                                                                {subItem.label}
                                                                            </span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            );
                                                        })}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                }

                                return (
                                    <SidebarMenuItem key={idx}>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                "h-11 px-3 rounded-xl transition-all duration-200",
                                                "hover:bg-accent hover:text-accent-foreground hover:translate-x-0.5",
                                                isActive
                                                    ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-primary font-semibold shadow-sm border border-primary/20 dark:from-primary/20 dark:via-primary/10"
                                                    : "text-muted-foreground hover:shadow-sm"
                                            )}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className={cn(
                                                    "size-5 transition-all",
                                                    isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:scale-105"
                                                )} />
                                                <span className="text-sm">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="">
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    );
}

export default DashboardSidebar;