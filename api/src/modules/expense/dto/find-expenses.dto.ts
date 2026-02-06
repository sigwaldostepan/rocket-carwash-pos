import { IsDateString, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto';

export class FindExpensesDto extends PaginationDto {
  @IsDateString({}, { message: 'Format tanggal tidak valid' })
  @IsOptional()
  dateFrom?: string;

  @IsDateString({}, { message: 'Format tanggal tidak valid' })
  @IsOptional()
  dateTo?: string;
}
