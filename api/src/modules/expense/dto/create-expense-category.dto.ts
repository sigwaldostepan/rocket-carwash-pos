import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateExpenseCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Kategori minimal 2 karakter' })
  @MaxLength(50, { message: 'Kategori gak boleh lebih dari 50 karakter' })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Deskripsi gak boleh lebih dari 255 karakter' })
  description?: string;
}
