import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class TransactionItemDto {
  @IsNotEmpty({ message: 'ID item gk boleh kosong' })
  @IsString()
  itemId: string;

  @Min(0, { message: 'Quantity gk boleh negatif' })
  @IsNumber()
  quantity: number;

  @IsOptional()
  @Min(0, { message: 'Jumlah item yg diredeem gk boleh negatif' })
  @IsNumber()
  redeemedQuantity?: number;
}

export class CreateTransactionDto {
  @IsUUID()
  @IsOptional()
  @IsString()
  customerId: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];

  @IsNotEmpty({ message: 'Metode pembayaran gk boleh kosong' })
  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsBoolean()
  isCompliment?: boolean;

  @IsOptional()
  @Min(0, { message: 'Nilai komplimen gak boleh negatif' })
  @IsNumber()
  complimentAmount: number;

  @IsOptional()
  @IsBoolean()
  isNightShift?: boolean;
}
