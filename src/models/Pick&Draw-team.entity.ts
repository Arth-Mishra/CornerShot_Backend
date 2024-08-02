import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contestant } from './contestant.entity';
import { Roping } from './roping.entity';

@Entity('pick-and-draw_teams')
export class PickAndDrawTeam {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Contestant)
  header: Contestant;

  @ManyToOne(() => Contestant)
  healer: Contestant;

  @ManyToOne(() => Roping)
  roping: Roping;

  @Column({ default: true })
  checkTeams: boolean;

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
