import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class DraftItemDto {
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

export class CreateDraftDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DraftItemDto)
  items: DraftItemDto[];
}
