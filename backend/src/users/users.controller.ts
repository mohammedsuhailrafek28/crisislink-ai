import { Body, Controller, ForbiddenException, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SearchUsersDto } from './dto/search-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  searchUsers(@Query() query: SearchUsersDto) {
    return this.usersService.search(query);
  }

  @Get(':id')
  getPublicProfile(@Param('id') id: string) {
    return this.usersService.findPublicById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/profile')
  updateMyProfile(@Req() request: { user: { id: string } }, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(request.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/profile')
  updateProfileById(
    @Param('id') id: string,
    @Req() request: { user: { id: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    if (request.user.id !== id) {
      throw new ForbiddenException('You can only edit your own profile');
    }

    return this.usersService.updateProfile(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/follow')
  followUser(@Param('id') id: string, @Req() request: { user: { id: string } }) {
    return this.usersService.followUser(request.user.id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/unfollow')
  unfollowUser(@Param('id') id: string, @Req() request: { user: { id: string } }) {
    return this.usersService.unfollowUser(request.user.id, id);
  }
}