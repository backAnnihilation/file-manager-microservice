import { IsString } from 'class-validator';
import { BaseImageDto } from './base-image.model';

export class InputPostImageDto extends BaseImageDto {
  @IsString()
  postId: string;
  @IsString()
  userId: string;
}
