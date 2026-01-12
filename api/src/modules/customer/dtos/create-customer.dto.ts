import { IsDefined, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsDefined({ message: 'Nama tidak boleh kosong' })
  name: string;

  @IsString()
  @MaxLength(15, { message: 'Nomor telepon kepanjangan' })
  @IsDefined({ message: 'Nomor telepon gak boleh kosong' })
  phoneNumber: string;
}
