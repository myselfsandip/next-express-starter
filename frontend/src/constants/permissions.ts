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

export const SCOPES = {
    GLOBAL: 'global',
    OWN: 'own',
} as const;


export type Module = typeof MODULES[keyof typeof MODULES];
export type Action = typeof ACTIONS[keyof typeof ACTIONS];
export type Scope = typeof SCOPES[keyof typeof SCOPES];