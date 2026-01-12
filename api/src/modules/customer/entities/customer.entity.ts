import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ default: 0, nullable: true })
  point: number = 0;

  @OneToMany(() => Transaction, (transaction) => transaction.customer, {
    cascade: true,
  })
  transaction: Transaction[];
}
