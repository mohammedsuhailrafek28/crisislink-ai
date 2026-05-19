import { Body, Controller, Get, Post, Query, UseGuards, Req, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FeedService } from './feed.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createPost(@Req() request: { user: { id: string } }, @Body() dto: CreatePostDto) {
    return this.feedService.createPost(request.user.id, dto);
  }

  @Get()
  getFeed(@Query('page') page: string = '1', @Query('limit') limit: string = '20') {
    return this.feedService.getFeed(parseInt(page), parseInt(limit));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/like')
  likePost(@Req() request: { user: { id: string } }, @Param('id') postId: string) {
    return this.feedService.likePost(request.user.id, postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/unlike')
  unlikePost(@Req() request: { user: { id: string } }, @Param('id') postId: string) {
    return this.feedService.unlikePost(request.user.id, postId);
  }
}
