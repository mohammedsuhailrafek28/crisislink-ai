import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private sanitize(user: User) {
    const { passwordHash, followers, following, ...safeUser } = user;
    return safeUser;
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    talentType: string;
    city?: string;
    country?: string;
  }) {
    const existingUser = await this.usersRepository.findOne({ where: { email: data.email.toLowerCase() } });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const user = this.usersRepository.create({
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      fullName: data.fullName,
      talentType: data.talentType,
      city: data.city ?? null,
      country: data.country ?? null,
      bio: null,
      profilePhoto: null,
      verified: false,
      skills: [],
    });

    return this.sanitize(await this.usersRepository.save(user));
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email: email.toLowerCase() } });
  }

  async findById(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findPublicById(id: string) {
    return this.sanitize(await this.findById(id));
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.findById(userId);
    Object.assign(user, {
      ...dto,
      bio: dto.bio ?? user.bio,
      profilePhoto: dto.profilePhoto ?? user.profilePhoto,
      city: dto.city ?? user.city,
      country: dto.country ?? user.country,
      skills: dto.skills ?? user.skills,
      fullName: dto.fullName ?? user.fullName,
      talentType: dto.talentType ?? user.talentType,
    });

    return this.sanitize(await this.usersRepository.save(user));
  }

  async search(filters: { q?: string; talentType?: string; city?: string }) {
    const query = this.usersRepository.createQueryBuilder('user');

    if (filters.q) {
      query.andWhere('(LOWER(user.fullName) LIKE :q OR LOWER(user.email) LIKE :q OR LOWER(COALESCE(user.bio, \'\')) LIKE :q)', {
        q: `%${filters.q.toLowerCase()}%`,
      });
    }

    if (filters.talentType) {
      query.andWhere('LOWER(user.talentType) = :talentType', { talentType: filters.talentType.toLowerCase() });
    }

    if (filters.city) {
      query.andWhere('LOWER(user.city) = :city', { city: filters.city.toLowerCase() });
    }

    return (await query.orderBy('user.createdAt', 'DESC').getMany()).map((user) => this.sanitize(user));
  }

  async followUser(followerId: string, targetId: string) {
    if (followerId === targetId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const follower = await this.usersRepository.findOne({
      where: { id: followerId },
      relations: ['following'],
    });
    const target = await this.usersRepository.findOne({
      where: { id: targetId },
      relations: ['followers'],
    });

    if (!follower || !target) {
      throw new NotFoundException('User not found');
    }

    const alreadyFollowing = (follower.following ?? []).some((user) => user.id === target.id);
    if (!alreadyFollowing) {
      follower.following = [...(follower.following ?? []), target];
      target.followers = [...(target.followers ?? []), follower];
      await this.usersRepository.save(follower);
      await this.usersRepository.save(target);
    }

    return { following: true };
  }

  async unfollowUser(followerId: string, targetId: string) {
    const follower = await this.usersRepository.findOne({
      where: { id: followerId },
      relations: ['following'],
    });
    const target = await this.usersRepository.findOne({
      where: { id: targetId },
      relations: ['followers'],
    });

    if (!follower || !target) {
      throw new NotFoundException('User not found');
    }

    follower.following = (follower.following ?? []).filter((user) => user.id !== target.id);
    target.followers = (target.followers ?? []).filter((user) => user.id !== follower.id);

    await this.usersRepository.save(follower);
    await this.usersRepository.save(target);

    return { following: false };
  }
}