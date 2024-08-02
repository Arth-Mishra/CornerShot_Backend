import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roping } from './roping.entity';

@Entity('roping_rules')
export class RopingRules {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  progressive_after_round: number;

  @Column()
  barrier_penalty: number;

  @Column()
  leg_penalty: number;

  @Column()
  classification: number;

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

  @ManyToOne(() => Roping, (roping) => roping.ropingRules)
  roping: Roping;
}