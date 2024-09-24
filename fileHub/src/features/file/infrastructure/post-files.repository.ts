import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { PostImageMeta } from '../domain/entities/post-image-meta.schema';
import { BaseRepository } from '../../../core/db/base.files.repository';

@Injectable()
export class PostsRepository<T extends Document> extends BaseRepository<T> {
  constructor(@InjectModel(PostImageMeta.name) postFileModel: Model<T>) {
    super(postFileModel);
  }
}
