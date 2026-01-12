import { IsNumber, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @MaxLength(255, { message: 'Deskripsi gak boleh lebih dari 255 karakter' })
  description?: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsUUID()
  categoryId: string;
}
