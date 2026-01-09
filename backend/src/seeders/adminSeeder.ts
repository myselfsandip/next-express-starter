import "dotenv/config";
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import { roles, users } from '../db/schema.js';
import { STATIC_ROLES } from '../constants/permissions.js';
import { db } from "../db/index.js";
import { Env } from "../config/env.config.js";

async function seedAdmin() {
    console.log('Starting admin seeder...');

    if (Env.NODE_ENV === 'production') {
        const confirmation = Env.SEED_CONFIRM;
        if (confirmation !== 'CONFIRM_ADMIN_SEED') {
            console.error('PRODUCTION SEED BLOCKED!');
            console.error('Set SEED_CONFIRM=CONFIRM_ADMIN_SEED in .env');
            process.exit(1);
        }
        console.log('PRODUCTION SEED EXECUTING...');
    }


    if (!Env.DATABASE_URL) {
        console.error('DATABASE_URL is required in env');
        process.exit(1);
    }


    try {
        const existingRole = await db.select()
            .from(roles)
            .where(eq(roles.key, STATIC_ROLES.ADMIN))
            .limit(1);

        let adminRoleId: string;

        if (!existingRole[0]) {
            const [newRole] = await db.insert(roles)
                .values({
                    id: nanoid(),
                    name: 'Administrator',
                    key: STATIC_ROLES.ADMIN,
                    description: 'Full system access - system created role',
                    isSystem: true,
                    isActive: true,
                })
                .returning();

            adminRoleId = newRole.id;
            console.log('SYSTEM ADMIN role created:', {
                id: adminRoleId,
                key: newRole.key,
                name: newRole.name
            });
        } else {
            adminRoleId = existingRole[0].id;
            console.log('SYSTEM ADMIN role exists:', adminRoleId);
        }

        const existingAdmin = await db.select()
            .from(users)
            .where(eq(users.email, 'admin@system.com'))
            .limit(1);

        if (!existingAdmin[0]) {
            const hashedPassword = await bcrypt.hash('Admin@5678', 12);

            const [newUser] = await db.insert(users).values({
                id: nanoid(),
                email: 'admin@system.com',
                name: 'System Administrator',
                password: hashedPassword,
                roleId: adminRoleId,
                isDeleted: false,
                banned: false,
            }).returning();

            console.log('SYSTEM ADMIN user created:', {
                id: newUser.id,
                email: newUser.email,
                roleId: adminRoleId
            });
        } else {
            console.log('SYSTEM ADMIN user exists:', existingAdmin[0].email);
        }

        console.log('\n SYSTEM BOOTSTRAP COMPLETE!');
        console.log(' Login credentials:');
        console.log('   Email: admin@system.com');
        console.log('   Password: Admin@5678');
        console.log('\n  IMMEDIATELY:');
        console.log('   1. Login and change password');
        console.log('   2. Create additional admins');
        console.log('   3. Delete this seed script');

    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

// seedAdmin().catch(console.error);

