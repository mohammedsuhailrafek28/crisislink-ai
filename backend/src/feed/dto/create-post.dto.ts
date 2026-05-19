import { IsString, MinLength, MaxLength, IsOptional, IsIn } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @IsOptional()
  @IsIn(['image', 'video'])
  mediaType?: 'image' | 'video';
}
