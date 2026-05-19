import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from '../../users/entities/user.entity';

@Entity('post_likes')
@Unique(['userId', 'postId'])
export class PostLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;

  @Column()
  postId: string;

  @CreateDateColumn()
  createdAt: Date;
}
