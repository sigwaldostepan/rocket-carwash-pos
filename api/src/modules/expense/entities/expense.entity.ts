import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExpenseCategory } from './expense-category.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 255,
    nullable: true,
    default: null,
  })
  description: string;

  @Column({ type: 'decimal', default: 0 })
  amount: number;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @ManyToOne(() => ExpenseCategory, (category) => category.expenseTransaction, {
    cascade: false,
    eager: true,
  })
  category: ExpenseCategory;
}
