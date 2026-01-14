import { ConfigType, registerAs } from '@nestjs/config';

export const env = {
  // Environment
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  // DB ORM
  APP_ORM: process.env.APP_ORM,

  // Prisma
  DATABASE_URL: process.env.DATABASE_URL,

  // TypeORM
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,

  // Auth
  CASHIER_ACCOUNT_EMAIL: process.env.CASHIER_ACCOUNT_EMAIL,
  CASHIER_ACCOUNT_PASSWORD: process.env.CASHIER_ACCOUNT_PASSWORD,
  OWNER_ACCOUNT_EMAIL: process.env.OWNER_ACCOUNT_EMAIL,
  OWNER_ACCOUNT_PASSWORD: process.env.OWNER_ACCOUNT_PASSWORD,

  // CORS
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
};

export const envConfig = registerAs('env', () => env);

export const envKey = envConfig.KEY;
export type ENV_KEY = ConfigType<typeof envConfig>;
