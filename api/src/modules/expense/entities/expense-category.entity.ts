import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Expense } from './expense.entity';

@Entity()
export class ExpenseCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    length: 255,
    nullable: true,
    default: null,
  })
  description: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @OneToMany(() => Expense, (expense) => expense.category)
  expenseTransaction: Expense;
}
