import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Roping } from './roping.entity';

@Entity('roping_classification')
export class RopingClassification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  round_to_handicap: number;

  @Column()
  amount_to_handicap: number;

  @Column()
  handicap_down_amount: number;

  @Column()
  handicap_up_amount: number;

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

  @ManyToOne(() => Roping, (roping) => roping.ropingClassification)
  roping: Roping;
}