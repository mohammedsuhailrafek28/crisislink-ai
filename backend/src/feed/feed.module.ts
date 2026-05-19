import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostLike, Comment])],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
