import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Contestant } from './contestant.entity';
import { Roping } from './roping.entity';





@Entity('pickonly_teams')
export class PickonlyTeam {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Contestant)
  @JoinColumn({ name: 'header_id', referencedColumnName: 'id' })
  header: Contestant;

  @ManyToOne(() => Contestant)
  @JoinColumn({ name: 'healer_id', referencedColumnName: 'id' })
  healer: Contestant;

  @ManyToOne(() => Roping)
  @JoinColumn({ name: 'roping_id', referencedColumnName: 'id' })
  roping: Roping;

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
