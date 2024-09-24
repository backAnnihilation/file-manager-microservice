import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { ProfileImageMeta } from '../domain/entities/user-profile-image-meta.schema';
import { BaseRepository } from '../../../core/db/base.files.repository';

@Injectable()
export class ProfilesRepository<T extends Document> extends BaseRepository<T> {
  constructor(@InjectModel(ProfileImageMeta.name) profileImageModel: Model<T>) {
    super(profileImageModel);
  }
}
