import { Controller, Get } from '@nestjs/common';
import { OptionalAuth } from '@thallesp/nestjs-better-auth';

@Controller('health')
export class HealthController {
  @OptionalAuth()
  @Get()
  public check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
