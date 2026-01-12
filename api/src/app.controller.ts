import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get('')
  public welcome() {
    return {
      message: 'Bro mengakses API rocket carwash',
    };
  }
}
