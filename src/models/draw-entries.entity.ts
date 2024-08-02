import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Roping } from './roping.entity';
import { Contestant } from './contestant.entity';

@Entity('draw_entries')
export class DrawEntries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  header_rating: number;

  @Column()
  healer_rating: number;

  @Column()
  header_entries: number;

  @Column()
  healer_entries: number;

  @ManyToOne(() => Roping)
  roping: Roping;

  @ManyToOne(() => Contestant)
  contestant: Contestant;

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


}
