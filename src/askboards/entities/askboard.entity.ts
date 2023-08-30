import { Users } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Reply } from './reply.entity';

@Entity()
export class Askboard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Exclude()
  @ManyToOne(() => Users, (user) => user.askboard)
  user: Users;

  @OneToMany(() => Reply, (reply) => reply.askboard)
  replies: Reply[];
}
