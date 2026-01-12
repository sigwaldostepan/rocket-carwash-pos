import { Module } from '@nestjs/common';
import { TypeOrmModule as TypeOrmModuleBase } from '@nestjs/typeorm';
import { typeormConfig } from './typeorm.config';

@Module({
  imports: [TypeOrmModuleBase.forRoot({ ...typeormConfig, autoLoadEntities: true })],
})
export class TypeOrmModule {}
