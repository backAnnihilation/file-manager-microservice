import { IsEnum } from 'class-validator';

import { FileFormat, ImageType } from '../enums/file-details.enum';
import { ContentType } from '../output-models/file-output-types';

export type FileExtractedType = {
  buffer: Buffer;
  originalname: string;
  mimetype: ContentType;
  size: number;
};

export type FileUploadType = FileExtractedType & FileFormatType;

export type FileFormatType = {
  fileFormat: FileFormat;
  fileType: ImageType;
  profileId: string;
};

export class InputFileTypesDto {
  @IsEnum(FileFormat)
  fileFormat: FileFormat;
  @IsEnum(ImageType)
  fileType: ImageType;
}
