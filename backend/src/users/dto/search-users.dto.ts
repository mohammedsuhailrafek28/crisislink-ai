import { IsOptional, IsString } from 'class-validator';

export class SearchUsersDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  talentType?: string;

  @IsOptional()
  @IsString()
  city?: string;
}