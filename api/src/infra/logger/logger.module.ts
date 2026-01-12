import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from './logger.config';

@Module({
  imports: [WinstonModule.forRoot({ ...loggerOptions })],
})
export class LoggerModule {}
