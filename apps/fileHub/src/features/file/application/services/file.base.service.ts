import { CommandBus } from '@nestjs/cqrs';
import { BaseCUDApiService } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { FilesQueryRepository } from '../../api/files.query.repository';
import { UploadFileCommand } from '../use-cases/upload-file.use-case';
import { UploadProfileImageCommand } from '../use-cases/upload-profile-image.use-case';
import { UploadPostImageCommand } from '../use-cases/upload-post-image.use-case';
import {
  IProfileImageViewModelType,
  IPostImageViewModelType,
} from '@app/shared';

@Injectable()
export class FilesBaseApiService extends BaseCUDApiService<
  UploadFileCommand | UploadProfileImageCommand | UploadPostImageCommand,
  IProfileImageViewModelType | IPostImageViewModelType
> {
  constructor(commandBus: CommandBus, queryRepo: FilesQueryRepository) {
    super(commandBus, queryRepo);
  }
}
