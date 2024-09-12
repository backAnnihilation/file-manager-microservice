import { CommandBus } from '@nestjs/cqrs';
import { ImageViewModelType } from '@models/file.models';
import { Injectable } from '@nestjs/common';
import { BaseCUDApiService } from '@file/core/api/services/base-cud-api.service';
import { FilesQueryRepository } from '../../api/files.query.repository';
import { UploadFileCommand } from '../use-cases/upload-file.use-case';
import { UploadProfileImageCommand } from '../use-cases/upload-profile-image.use-case';
import { UploadPostImageCommand } from '../use-cases/upload-post-image.use-case';

@Injectable()
export class FilesBaseApiService extends BaseCUDApiService<
  UploadFileCommand | UploadProfileImageCommand | UploadPostImageCommand,
  ImageViewModelType
> {
  constructor(commandBus: CommandBus, queryRepo: FilesQueryRepository) {
    super(commandBus, queryRepo);
  }
}
