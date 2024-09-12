import { FilesStorageAdapter } from '@file/core/adapters/local-files-storage.adapter';
import { OutputId, OutputIdAndUrl } from '@models/output-id.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LayerNoticeInterceptor } from '@shared/notification';
import * as sharp from 'sharp';
import { FileType } from '@models/file.models';

import { ImageType } from '../../api/models/enums/file-details.enum';
import { ContentType } from '../../api/models/output-models/file-output-types';
import {
  CreateFileMetaDto,
  CreatePostFileMetaDto,
  FileMeta,
  FileMetaModel,
} from '../../domain/entities/file-meta.schema';
import { FilesRepository } from '../../infrastructure/files.repository';
import {
  PostFileMeta,
  PostFileMetaModel,
} from '../../domain/entities/post-file-meta.schema';

@Injectable()
export class FilesService {
  private readonly location: string;
  constructor(
    private readonly filesRepo: FilesRepository,
    private readonly filesAdapter: FilesStorageAdapter,
    @InjectModel(FileMeta.name) private FileMetadata: FileMetaModel,
    @InjectModel(PostFileMeta.name) private PostFileMetadata: PostFileMetaModel,
  ) {
    this.location = this.constructor.name;
  }

  async saveFileMeta(
    fileMetaDto: CreateFileMetaDto,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    try {
      const fileNotice = await this.FileMetadata.makeInstance(fileMetaDto);

      if (fileNotice.hasError) return fileNotice as LayerNoticeInterceptor;

      const result = await this.filesRepo.save(fileNotice.data);
      return new LayerNoticeInterceptor(result);
    } catch (error) {
      throw new Error(`${this.location}: ${error}`);
    }
  }
  async savePostFileMeta(
    postFileMetaDto: CreatePostFileMetaDto,
  ): Promise<LayerNoticeInterceptor<OutputIdAndUrl>> {
    try {
      const fileNotice =
        await this.PostFileMetadata.makeInstance(postFileMetaDto);

      if (fileNotice.hasError) return fileNotice as LayerNoticeInterceptor;

      const result = await this.filesRepo.savePostFIle(fileNotice.data);
      return new LayerNoticeInterceptor(result);
    } catch (error) {
      throw new Error(`${this.location}: ${error}`);
    }
  }

  generateImageKey = (keyInfo: GenerateImageKeyType) => {
    const { profileId, imageType, contentType, fileName } = keyInfo;
    const [, fileExtension] = contentType.split('/');
    const timeStamp = new Date().getTime();
    const withExtension = fileName.endsWith(fileExtension);
    const fileSignature = withExtension ? fileName.split('.')[0] : fileName;

    const generatedKey = `images/users/profiles/${imageType}/profileId-${profileId}/${fileSignature}${timeStamp}.${fileExtension}`;

    return { Key: generatedKey, ContentType: contentType };
  };

  generatePostImageKey = (keyInfo: GeneratePostImageKeyType) => {
    const { userId, imageType, contentType, fileName } = keyInfo;
    const [, fileExtension] = contentType.split('/');
    const timeStamp = new Date().getTime();
    const withExtension = fileName.endsWith(fileExtension);
    const fileSignature = withExtension ? fileName.split('.')[0] : fileName;

    const generatedKey = `images/users/profiles/${imageType}/userId-${userId}/${fileSignature}${timeStamp}.${fileExtension}`;

    return { Key: generatedKey, ContentType: contentType };
  };

  convertPhotoToStorageFormat = async (buffer: any): Promise<Buffer> =>
    await sharp(buffer).webp({ quality: 80 }).toBuffer();
}

type GenerateImageKeyType = {
  fileName: string;
  contentType: ContentType;
  imageType: ImageType;
  profileId: string;
};

type GeneratePostImageKeyType = {
  fileName: string;
  contentType: ContentType;
  imageType: ImageType;
  userId: string;
};