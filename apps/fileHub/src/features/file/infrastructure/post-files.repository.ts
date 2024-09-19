import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { BaseRepository } from '@file/core/db/base.files.repository';
import { PostImageMeta } from '../domain/entities/post-image-meta.schema';

@Injectable()
export class PostsRepository<T extends Document> extends BaseRepository<T> {
  constructor(@InjectModel(PostImageMeta.name) postFileModel: Model<T>) {
    super(postFileModel);
  }
}
