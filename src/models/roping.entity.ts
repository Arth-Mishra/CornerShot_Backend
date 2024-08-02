import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Production } from './production.entity';
import { RopingRules } from './roping-rules.entity';
import { RopingFinancials } from './roping-financials.entity';
import { RopingClassification } from './roping-classification.entity';
import { DrawEntries } from './draw-entries.entity';


export enum RopingType {
  Draw_Pot = 'Draw Pot',
  Pick_And_Draw = 'Pick & Draw',
  Pick_Only = 'Pick Only',
  Pick_or_Draw = 'Pick or Draw',
  Round_Robin = 'Round Robin',
}


@Entity('ropings')
export class Roping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: RopingType,
  })
  type: RopingType;

  @Column({
    type: 'int',
    nullable: true,
  })
  draw_count: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  max_entries_per_roper: number | null;

  @Column()
  num_rounds: number;

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

  @ManyToOne(() => Production)
  production: Production;

  @OneToOne(() => RopingRules, (ropingRules) => ropingRules.roping)
  ropingRules: RopingRules[];

  @OneToOne(
    () => RopingFinancials,
    (ropingFinancials) => ropingFinancials.roping,
  )
  ropingFinancials: RopingFinancials[];

  @OneToOne(
    () => RopingClassification,
    (ropingClassification) => ropingClassification.roping,
  )
  ropingClassification: RopingClassification;

  @OneToMany(() => DrawEntries, (drawEntries) => drawEntries.roping)
  drawEntries: DrawEntries[];
}
