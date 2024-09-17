import { FilesStorageAdapter } from '@file/core/adapters/local-files-storage.adapter';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ImageCategory, LayerNoticeInterceptor } from '@app/shared';
import * as sharp from 'sharp';
import { ContentType } from '../../api/models/output-models/file-output-types';
import { FilesRepository } from '../../infrastructure/files.repository';
import { ImageType, OutputId, OutputIdAndUrl } from '@app/shared';
import {
  PostImageMeta,
  PostImageMetaModel,
} from '../../domain/entities/post-image-meta.schema';
import { Connection, Model } from 'mongoose';
import {
  BaseImageMeta,
  BaseImageMetaModel,
} from '../../domain/entities/base-image-meta.schema';
import { ProfileImageMeta } from '../../domain/entities/user-profile-image-meta.schema';

@Injectable()
export class FilesService {
  private readonly location: string;
  constructor(
    private readonly filesRepo: FilesRepository,
    private readonly filesAdapter: FilesStorageAdapter,

    @InjectModel(PostImageMeta.name)
    private PostFileMetadata: PostImageMetaModel,
    @InjectConnection() private readonly connection: Connection,
  ) {
    this.location = this.constructor.name;
  }

  async saveFileMeta(
    imageMetaDto: any,
    // CreateFileMetaDto,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    try {
      const { modelName } = imageMetaDto;
      const model = this.getEntityModel(modelName);
      
      // const fileNotice = await this.PostFileMetadata.makeInstance(fileMetaDto);

      // if (fileNotice.hasError) return fileNotice as LayerNoticeInterceptor;

      // const result = await this.filesRepo.save(fileNotice.data);
      const result = { id: '1' };
      return new LayerNoticeInterceptor(result);
    } catch (error) {
      throw new Error(`${this.location}: ${error}`);
    }
  }

  // toDo move to use-case. The service is used for reuse, not for expanding it with new logic, if the logic differs from the "basic" then we create a use case
  // async savePostFileMeta(
  //   postFileMetaDto: CreatePostFileMetaDto,
  // ): Promise<LayerNoticeInterceptor<OutputIdAndUrl>> {
  //   try {
  //     const fileNotice =
  //       await this.PostFileMetadata.makeInstance(postFileMetaDto);

  //     if (fileNotice.hasError) return fileNotice as LayerNoticeInterceptor;

  //     const result = await this.filesRepo.savePostFIle(fileNotice.data);
  //     return new LayerNoticeInterceptor(result);
  //   } catch (error) {
  //     throw new Error(`${this.location}: ${error}`);
  //   }
  // }

  generateImageKey = (keyInfo: GenerateImageKeyType) => {
    const { profileId, imageCategory, contentType, fileName, postId } = keyInfo;
    const [, fileExtension] = contentType.split('/');
    const timeStamp = new Date().getTime();
    const withExtension = fileName.endsWith(fileExtension);
    const fileSignature = withExtension ? fileName.split('.')[0] : fileName;

    const entityId = this.extractEntityId(imageCategory, postId || profileId);
    const generatedKey = `images/${imageCategory}/${entityId}/${fileSignature}${timeStamp}.${fileExtension}`;

    return { Key: generatedKey, ContentType: contentType };
  };

  private extractEntityId = (category: ImageCategory, entityId) => {
    const categories = {
      post: 'postId',
      profile: 'profileId',
    };
    return `${categories[category]}-${entityId}`;
  };

  private getEntityModel = <T>(modelName: string): Model<T> => {
    const modelMap = {
      PostImageMeta: PostImageMeta,
      ProfileImageMeta: ProfileImageMeta
    }
    return this.connection.model(modelName);
  };

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
