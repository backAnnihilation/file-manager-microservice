import { IsObject } from 'class-validator';
import { FileMetadata } from '@app/shared';

export class BaseImageDto {
  @IsObject()
  image: FileMetadata;
}
