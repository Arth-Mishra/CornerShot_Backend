import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Roping } from './roping.entity';
@Entity('roping_financials')
export class RopingFinancials {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entry_fees: number;

  @Column()
  stock_charge_percent: number;

  @Column()
  association_fees: number;

  @Column()
  price_deduction: number;

  @Column()
  added_money: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @ManyToOne(() => Roping, (roping) => roping.ropingFinancials)
  roping: Roping;
}