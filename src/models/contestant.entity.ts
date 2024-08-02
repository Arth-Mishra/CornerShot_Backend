import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { DrawEntries } from './draw-entries.entity';


@Entity('contestants')
@Unique(['user', 'email'])
export class Contestant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone_number: string;

  @Column()
  email: string;

  @Column()
  header_rating: number;

  @Column()
  healer_rating: number;

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

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => DrawEntries, (drawEntries) => drawEntries.contestant)
  drawEntries: DrawEntries[];
}
