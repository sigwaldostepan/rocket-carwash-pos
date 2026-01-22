import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FindItemsDto {
  @IsOptional()
  @IsString({ message: 'Keyword harus berupa string' })
  @Transform(({ value }) => decodeURIComponent(value.trim()))
  search?: string;
}
