import { Item } from 'src/modules/item/entities/item.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class TransactionDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.details, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  transaction: Transaction;

  @ManyToOne(() => Item, (item) => item.transactionDetail, {
    onDelete: 'CASCADE',
  })
  item: Item;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 0 })
  redeemedQuantity: number;
}
