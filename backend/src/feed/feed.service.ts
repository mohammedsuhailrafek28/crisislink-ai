import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(userId: string, dto: CreatePostDto) {
    const post = this.postRepository.create({
      userId,
      content: dto.content,
      mediaUrl: dto.mediaUrl ?? null,
      mediaType: dto.mediaType ?? null,
    });

    return this.postRepository.save(post);
  }

  async getFeed(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [posts, total] = await this.postRepository.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      posts: posts.map((post) => ({
        ...post,
        user: {
          id: post.user.id,
          fullName: post.user.fullName,
          email: post.user.email,
          profilePhoto: post.user.profilePhoto,
          avatarUrl: post.user.avatarUrl,
          talentType: post.user.talentType,
          verified: post.user.verified,
        },
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async likePost(userId: string, postId: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) return null;

    await this.postRepository.update(postId, { likeCount: post.likeCount + 1 });
    return this.postRepository.findOne({ where: { id: postId }, relations: ['user'] });
  }

  async unlikePost(userId: string, postId: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) return null;

    await this.postRepository.update(postId, { likeCount: Math.max(0, post.likeCount - 1) });
    return this.postRepository.findOne({ where: { id: postId }, relations: ['user'] });
  }
}
