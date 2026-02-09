import { IsDateString, IsOptional } from 'class-validator';

export class DateRangeDto {
  @IsDateString({}, { message: 'Format tanggal tidak valid' })
  @IsOptional()
  dateFrom?: string;

  @IsDateString({}, { message: 'Format tanggal tidak valid' })
  @IsOptional()
  dateTo?: string;
}
