import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule as TypeOrmModuleBase } from '@nestjs/typeorm';
import { typeormConfig } from './typeorm.config';
import { DataSource } from 'typeorm';

@Module({
  imports: [ConfigModule, TypeOrmModuleBase.forRoot({ ...typeormConfig, autoLoadEntities: true })],
})
export class TypeOrmModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    const isInitialized = this.dataSource.isInitialized;

    if (!isInitialized) {
      this.dataSource
        .initialize()
        .then(() => 'Database connected [ORM: TypeORM]')
        .catch((err) => {
          console.log('Database connection error', err);
        });
    } else {
      console.log('Database already initialized [ORM: TypeORM]');
    }
  }
}
