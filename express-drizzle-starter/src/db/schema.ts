import {
    boolean,
    pgTable,
    text,
    timestamp,
    unique,
    varchar,
    primaryKey,
    pgEnum,
    integer,
    numeric,
    index,
    jsonb,
    date
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { nanoid } from "nanoid";



export const approveRejectEnum = pgEnum('approve_reject_field', ['pending', 'approved', 'rejected']);
export const auditLogActorEnum = pgEnum('actor_type_field', ["user", "system", "api_client"]);
export const scopeEnum = pgEnum('scope_field', ['own', 'global']);
export const actionsEnum = pgEnum('actions_field', ['create', 'read', 'update', 'delete']);




export const users = pgTable('users', {
    id: text('id').primaryKey().$default(() => nanoid()),
    email: varchar('email', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 100 }),
    password: text('password').notNull(),
    image: text('image'),
    refreshToken: text('refresh_token'),
    roleId: text('role_id').references(() => roles.id, { onDelete: 'restrict' }).notNull(),
    banned: boolean('banned').default(false).notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const roles = pgTable("roles", {
    id: text("id").primaryKey().$default(() => nanoid()),
    name: varchar("name", { length: 50 }).notNull(),        // Admin
    key: varchar("key", { length: 50 }).notNull(),          // ADMIN
    description: text("description"),
    isSystem: boolean("is_system").default(false).notNull(), // like admin
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ([
    unique().on(t.key),
]));

export const rolePermissions = pgTable('role_permissions', {
    roleId: text('role_id').references(() => roles.id, { onDelete: "cascade" }).notNull(),
    module: varchar('module', { length: 50 }).notNull(), // example: 'properties'
    action: actionsEnum('action').notNull(),
    scope: scopeEnum('scope').default("own").notNull(), // How Much They can see
}, (t) => ([
    //  A role can only have one rule per module+action
    primaryKey({ columns: [t.roleId, t.module, t.action] }),
]));

// Custom Permission
export const userPermissions = pgTable('user_permissions', {
    id: text('id').primaryKey().$default(() => nanoid()),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    module: varchar('module', { length: 50 }).notNull(),
    action: actionsEnum('action').notNull(),
    scope: scopeEnum('scope').notNull(), // example: Upgrade an agent to see 'global' properties
    isDenied: boolean('is_denied').default(false),
}, (t) => ({
    uniqueOverride: unique().on(t.userId, t.module, t.action)
}));


export const usersRelations = relations(users, ({ one, many }) => ({
    role: one(roles, {
        fields: [users.roleId],
        references: [roles.id]
    }),
    permissions: many(userPermissions),
}));



export const auditLogs = pgTable("audit_logs", {
    id: text("id").primaryKey().$default(() => nanoid()),
    actorType: auditLogActorEnum("actor_type").notNull(),
    actorMetadata: jsonb("actor_metadata"),
    ipAddress: varchar("ip_address", { length: 45 }).notNull(),
    eventType: varchar("event_type", { length: 100 }).notNull(), // example:  "user.login", "property.created"
    eventMetadata: jsonb("event_metadata"), // example  { propertyId: "prop_456" }
    userAgent: text("user_agent").notNull(),   //Example Mozilla/5.0
    userAgentType: varchar("user_agent_type", { length: 30 }).notNull(), //Example Browser,Mobile,api_client
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
    index("audit_logs_expires_at_idx").on(table.expiresAt).where(sql`${table.expiresAt} IS NOT NULL`),
    index("audit_logs_event_type_idx").on(table.eventType),
    index("audit_logs_actor_type_idx").on(table.actorType),
    index("audit_logs_created_at_idx").on(table.createdAt),
]);


