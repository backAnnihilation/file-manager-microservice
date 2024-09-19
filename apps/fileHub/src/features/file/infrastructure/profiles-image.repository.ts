import { BaseRepository } from '@file/core/db/base.files.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { ProfileImageMeta } from '../domain/entities/user-profile-image-meta.schema';

@Injectable()
export class ProfilesRepository<T extends Document> extends BaseRepository<T> {
  constructor(@InjectModel(ProfileImageMeta.name) profileImageModel: Model<T>) {
    super(profileImageModel);
  }
}
