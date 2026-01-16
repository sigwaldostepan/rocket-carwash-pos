import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class BatchDeleteDto {
  @IsArray({ message: 'id harus berupa array' })
  @IsString({ each: true, message: 'id harus berupa string' })
  @ArrayMinSize(1, { message: 'Minimal harus ada satu id' })
  ids: string[];
}
