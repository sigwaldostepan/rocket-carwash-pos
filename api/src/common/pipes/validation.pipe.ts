import { BadRequestException, ValidationPipe as NestValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.map((error) => {
          return {
            field: error.property,
            message: Object.values(error.constraints)[0],
          };
        });

        return new BadRequestException({
          message: 'Validation error',
          errors: formattedErrors,
        });
      },
    });
  }
}
