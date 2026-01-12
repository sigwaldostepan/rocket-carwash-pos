import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama item gak boleh kosong' })
  @MaxLength(200, { message: 'Nama item maksimal 200 karakter' })
  name: string;

  @IsBoolean()
  @IsOptional()
  isRedeemable?: boolean;

  @IsBoolean()
  @IsOptional()
  isGetPoint?: boolean;

  @IsBoolean()
  @IsOptional()
  canBeComplimented?: boolean;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0, { message: 'Harga item gak boleh negatif' })
  price: number;
}
