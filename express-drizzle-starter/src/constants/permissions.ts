// export const ROLES = {
//     ADMIN: 'admin',
//     MANAGER: 'manager',
//     AGENT: 'leasing_agent',
//     STAFF: 'field_staff',
//     HR: 'hr',
// } as const;


export const STATIC_ROLES = {
    ADMIN: 'ADMIN'
} as const;

export const MODULES = {
    TASKS: 'tasks',
    EMPLOYEES: 'employees',
    DOCUMENTS: 'documents',
} as const;

export const ACTIONS = {
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
} as const;

// Scope allows you to define "Data Ownership"
export const SCOPES = {
    GLOBAL: 'global', // Can see everyone's data
    OWN: 'own',       // Can only see their own assigned data
} as const;


export type Module = typeof MODULES[keyof typeof MODULES];
export type Action = typeof ACTIONS[keyof typeof ACTIONS];
export type Scope = typeof SCOPES[keyof typeof SCOPES];