import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import {
  IProfileImageViewModelType,
  IPostImageViewModelType,
  BaseCUDApiService,
  RmqService,
} from '@app/shared';
import { FilesQueryRepository } from '../../api/files.query.repository';
import { UploadFileCommand } from '../use-cases/upload-file.use-case';
import { UploadProfileImageCommand } from '../use-cases/upload-profile-image.use-case';
import { UploadPostImageCommand } from '../use-cases/upload-post-image.use-case';
import { BaseEventsApiService } from '@file/core/api/services/base-events-api.service';

@Injectable()
export class FilesBaseApiService extends BaseEventsApiService<
  UploadFileCommand | UploadProfileImageCommand | UploadPostImageCommand,
  IProfileImageViewModelType | IPostImageViewModelType
> {
  constructor(
    rmqService: RmqService,
    commandBus: CommandBus,
    queryRepo: FilesQueryRepository,
  ) {
    super(rmqService, commandBus, queryRepo);
  }
}
