import { FileMetadata, ImageCategory } from '@app/shared';
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { Bucket } from '../../api/models/enums/file-models.enum';
import {
  ContentType,
  UploadFileOutputType,
} from '../../api/models/output-models/file-output-types';
import { FilesStorageAdapter } from '../../../../core/adapters/local-files-storage.adapter';

export type UploadImageType = {
  image: FileMetadata;
  imageCategory: ImageCategory;
  profileId?: string;
  postId?: string;
  bucket: Bucket;
};

@Injectable()
export class FilesService {
  constructor(private readonly filesAdapter: FilesStorageAdapter) {}

  async uploadFileInStorage(
    uploadFileDto: UploadImageType,
  ): Promise<UploadFileOutputType> {
    const {
      image: { buffer, mimetype, originalname },
      imageCategory,
      postId,
      profileId,
      bucket: Bucket,
    } = uploadFileDto;

    const { ContentType, Key } = this.generateImageKey({
      contentType: mimetype as ContentType,
      fileName: originalname,
      imageCategory,
      profileId,
      postId,
    });

    const buf = Buffer.from((buffer as any).data);
    const convertedBuffer = await this.convertPhotoToStorageFormat(buf);

    const bucketParams = {
      Bucket,
      Key,
      Body: convertedBuffer,
      ContentType,
    };

    return this.filesAdapter.uploadFile(bucketParams);
  }

  generateImageKey = (keyInfo: GenerateImageKeyType) => {
    const { profileId, imageCategory, contentType, fileName, postId } = keyInfo;

    const [, fileExtension] = contentType.split('/');
    const timeStamp = new Date().getTime();
    const withExtension = fileName.endsWith(fileExtension);
    const fileSignature = withExtension ? fileName.split('.')[0] : fileName;

    const basePath = this.getBasePathForCategory(
      imageCategory,
      postId,
      profileId,
    );

    const generatedKey = `${basePath}/${fileSignature}${timeStamp}.${fileExtension}`;

    return { Key: generatedKey, ContentType: contentType };
  };

  getBasePathForCategory = (
    category: ImageCategory,
    postId?: string,
    profileId?: string,
  ): string =>
    ({
      [ImageCategory.POST]: `images/posts/postId-${postId}`,
      [ImageCategory.PROFILE]: `images/profiles/profileId-${profileId}`,
    })[category];

  convertPhotoToStorageFormat = async (buffer: any): Promise<Buffer> =>
    await sharp(buffer).webp({ quality: 80 }).toBuffer();
}

type GenerateImageKeyType = {
  fileName: string;
  contentType: ContentType;
  imageCategory: ImageCategory;
  profileId?: string;
  postId?: string;
};
