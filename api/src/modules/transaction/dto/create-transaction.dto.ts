import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

// didn't use prisma's enum since there's legacy data from client's previous POS system
enum PaymentMethod {
  CASH = 'Tunai',
  QRIS = 'QRIS',
  EDC = 'EDC',
  Transfer = 'Transfer',
  Compliment = 'Komplimen',
}

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
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];

  @IsNotEmpty({ message: 'Metode pembayaran gk boleh kosong' })
  @IsEnum(PaymentMethod, { message: 'Metode pembayaran tidak valid' })
  paymentMethod: PaymentMethod;

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
