import { FileType } from '../../../../../../../../libs/shared/models/file.models';
import { FileFormat, ImageType } from '../enum/file-format.enums';

export type UploadFileDto = {
  image: FileType;
  userId: string;
};

export type ProfileImageToSendType = {
  fileFormat: FileFormat;
  image: FileType;
  fileType: ImageType;
};
