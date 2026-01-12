import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from 'generated/prisma/client';
import { env } from 'src/config/env.config';
import { auth } from 'src/infra/auth/auth.config';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const main = async () => {
  const cashierEmail = env.CASHIER_ACCOUNT_EMAIL;
  const cashierPassword = env.CASHIER_ACCOUNT_PASSWORD;

  if (!cashierEmail || !cashierPassword) {
    throw new Error('CASHIER_ACCOUNT_EMAIL and CASHIER_ACCOUNT_PASSWORD is not defined in .env');
  }

  const isCashierExists = await prisma.user.findUnique({
    where: {
      email: cashierEmail,
    },
  });

  if (isCashierExists) {
    console.log('Cashier already exists');
  } else {
    console.log('Seeding cashier account...');
    await auth.api.createUser({
      body: {
        name: 'Cashier',
        email: cashierEmail,
        password: cashierPassword,
        role: Role.cashier,
      },
    });
  }

  const ownerEmail = env.OWNER_ACCOUNT_EMAIL;
  const ownerPassword = env.OWNER_ACCOUNT_PASSWORD;

  if (!ownerEmail || !ownerPassword) {
    throw new Error('OWNER_ACCOUNT_EMAIL and OWNER_ACCOUNT_PASSWORD is not defined in .env');
  }

  const isOwnerExists = await prisma.user.findUnique({
    where: {
      email: ownerEmail,
    },
  });

  if (isOwnerExists) {
    console.log('Owner already exists');
  } else {
    console.log('Seeding owner account...');
    await auth.api.createUser({
      body: {
        name: 'Owner',
        email: ownerEmail,
        password: ownerPassword,
        role: Role.owner,
      },
    });
  }
};

main()
  .then(async () => {
    console.log('Seed completed');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
