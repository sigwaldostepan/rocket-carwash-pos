import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { PaginationDto } from 'src/common/dto';

export class FindExpensesDto extends PaginationDto {
  @MaxLength(10, { message: 'Tipe data tanggal gk valid' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Tipe tanggal gak valid',
  })
  @IsOptional()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => decodeURIComponent(value))
  description?: string;

  @IsIn(['daily', 'weekly', 'monthly', 'yearly', 'toToday'], { message: 'Range gak valid' })
  @IsOptional()
  range?: string;
}
