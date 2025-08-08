import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Record } from './record.entity';
import { User } from './user.entity';

@Entity('meditations')
export class Meditation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.meditations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Record, (record) => record.meditation)
  records: Record[];
}
