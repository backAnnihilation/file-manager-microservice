import { IPostImageViewModelType } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostImageMeta,
  PostImageMetaDocument,
  PostImageMetaModel,
} from '../domain/entities/post-image-meta.schema';
import { BaseFilesQueryRepository } from '../../../core/api/base-files-query-repository';

@Injectable()
export class PostsQueryRepository extends BaseFilesQueryRepository<
  PostImageMetaDocument,
  IPostImageViewModelType
> {
  constructor(
    @InjectModel(PostImageMeta.name) postImageModel: PostImageMetaModel,
  ) {
    super(postImageModel);
  }
}
