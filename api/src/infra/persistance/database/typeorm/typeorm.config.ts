import { join } from 'path';
import { env } from 'src/config/env.config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT, 5432),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  synchronize: env.NODE_ENV === 'production' ? false : true,
  entities: [join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.ts')],
  migrationsRun: false,
};

const TypeOrmDataSource = new DataSource(typeormConfig);

export default TypeOrmDataSource;
