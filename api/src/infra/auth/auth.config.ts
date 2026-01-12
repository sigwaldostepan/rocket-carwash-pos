import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { admin as adminPlugin, bearer, createAccessControl } from 'better-auth/plugins';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';
import { env } from 'src/config/env.config';

const trustedOrigins = env.ALLOWED_ORIGIN.split(',') ?? [''];

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const statements = {
  ...defaultStatements,
  customer: ['create', 'read', 'update', 'delete'],
  item: ['create', 'read', 'update', 'delete'],
  transaction: ['create', 'read', 'update', 'delete'],
  expense: ['create', 'read', 'update', 'delete'],
} as const;

const ac = createAccessControl(statements);

const cashier = ac.newRole({
  customer: ['create', 'read', 'update', 'delete'],
  item: ['create', 'read', 'update', 'delete'],
  transaction: ['create', 'read'],
  ...adminAc.statements,
});

const owner = ac.newRole({
  customer: ['create', 'read', 'update', 'delete'],
  item: ['create', 'read', 'update', 'delete'],
  transaction: ['create', 'read', 'update', 'delete'],
  expense: ['create', 'read', 'update', 'delete'],
  ...adminAc.statements,
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  trustedOrigins,
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        cashier,
        owner,
      },
    }),
    bearer(),
  ],
  user: {
    additionalFields: {
      role: {
        type: ['cashier', 'owner'],
        defaultValue: 'cashier',
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
