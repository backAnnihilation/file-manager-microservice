import { FileType } from '@models/file.models';
import { IsEnum, IsObject, IsString } from 'class-validator';
import { FileFormat, ImageType } from '../enums/file-details.enum';

export class UploadProfileImageDto {
  @IsObject()
  image: FileType;

  @IsEnum(FileFormat)
  fileFormat: FileFormat;

  @IsEnum(ImageType)
  fileType: ImageType;

  @IsString()
  profileId: string;
}

export class UploadPostImageDto {
  @IsObject()
  image: Express.Multer.File;

  @IsEnum(FileFormat)
  fileFormat: FileFormat;

  @IsEnum(ImageType)
  fileType: ImageType;

  @IsString()
  userId: string;
}
