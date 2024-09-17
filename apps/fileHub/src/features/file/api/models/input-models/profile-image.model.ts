import { IsString } from 'class-validator';
import { BaseImageDto } from './base-image.model';

export class InputProfileImageDto extends BaseImageDto {
  // @IsEnum(FileFormat)
  // fileFormat: FileFormat;
  @IsString()
  profileId: string;
}
