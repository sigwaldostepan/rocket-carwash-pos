import { IsDefined, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsDefined({ message: 'Nama tidak boleh kosong' })
  name: string;

  @IsPhoneNumber('ID', { message: 'Format nomor telepon harus 08xxxxxxxxxx.' })
  @IsString()
  @MaxLength(15, { message: 'Nomor telepon kepanjangan' })
  @IsDefined({ message: 'Nomor telepon gak boleh kosong' })
  phoneNumber: string;
}
