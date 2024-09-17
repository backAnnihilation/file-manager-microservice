import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  IPostImageViewModelType,
  IProfileImageViewModelType,
} from '@app/shared';
import {
  PostImageMeta,
  PostImageMetaModel,
  PostImageMetaDocument,
} from '../domain/entities/post-image-meta.schema';

@Injectable()
export class FilesQueryRepository {
  constructor(
    @InjectModel(PostImageMeta.name) private fileModel: PostImageMetaModel,
  ) {}

  async getById(id: string) {
    try {
      const result = await this.fileModel.findById(id);
      if (!result) return null;
      return this.fileToViewModel(result);
    } catch (error) {
      console.error(`Database fails operate during the find blog`, error);
      return null;
    }
  }

  private fileToViewModel = (file: any): IProfileImageViewModelType => ({
    id: file._id.toString(),
    url: file.fileUrl,
    profileId: file.profileId,
    createdAt: file.createdAt.toString(),
  });

  private postImageToViewModel = (
    image: PostImageMetaDocument,
  ): IPostImageViewModelType => ({
    id: image._id.toString(),
    url: image.url,
    postId: image.postId,
    createdAt: image.createdAt.toString(),
  });
}
