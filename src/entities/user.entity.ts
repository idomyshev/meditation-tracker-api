import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Meditation } from './meditation.entity';
import { Record } from './record.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  active: boolean;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Meditation, meditation => meditation.user)
  meditations: Meditation[];

  @OneToMany(() => Record, record => record.user)
  records: Record[];
} 