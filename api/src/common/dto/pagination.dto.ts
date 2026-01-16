import { IsNumber, IsOptional, Min, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from 'src/constants/pagination';

export class PaginationDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = DEFAULT_PAGINATION_PAGE;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = DEFAULT_PAGINATION_LIMIT;

  @IsOptional()
  @IsString()
  by?: string;

  get offset() {
    return (this.page - 1) * this.limit;
  }
}
