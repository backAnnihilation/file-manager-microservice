import { IProfileImageViewModelType } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProfileImageDocument,
  ProfileImageMeta,
  ProfileImageModel,
} from '../domain/entities/user-profile-image-meta.schema';
import { BaseFilesQueryRepository } from '../../../core/api/base-files-query-repository';

@Injectable()
export class ProfilesQueryRepository extends BaseFilesQueryRepository<
  ProfileImageDocument,
  IProfileImageViewModelType
> {
  constructor(
    @InjectModel(ProfileImageMeta.name) profileImageModel: ProfileImageModel,
  ) {
    super(profileImageModel);
  }
}
