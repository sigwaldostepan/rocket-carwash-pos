import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionDetail } from './transaction-detail.entity';
import { Customer } from 'src/modules/customer/entities/customer.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: false })
  invoiceNo: string;

  @OneToMany(() => TransactionDetail, (detail) => detail.transaction, {
    cascade: true,
  })
  details: TransactionDetail[];

  @ManyToOne(() => Customer, (customer) => customer.transaction, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  customer: Customer;

  @Column({ type: 'decimal', default: 0 })
  transTotal: number;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ default: false })
  isCompliment?: boolean;

  @Column({ type: 'decimal', default: 0 })
  complimentValue: number;

  @Column({ default: false })
  isNightShift: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;
}
