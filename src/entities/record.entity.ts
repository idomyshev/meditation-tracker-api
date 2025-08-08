import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Meditation } from './meditation.entity';
import { User } from './user.entity';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  meditationId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.records)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Meditation, (meditation) => meditation.records)
  @JoinColumn({ name: 'meditationId' })
  meditation: Meditation;
}
