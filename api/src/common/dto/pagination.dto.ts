import { IsNumber, IsOptional, Min, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  by?: string;

  get offset() {
    return (this.page - 1) * this.limit;
  }
}
