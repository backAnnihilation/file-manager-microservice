import {
  IPostImageViewModelType,
  IProfileImageViewModelType,
  RmqService,
} from '@app/shared';
import { BaseEventsApiService } from '@file/core/api/services/base-events-api.service';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FilesQueryRepository } from '../../api/files.query.repository';
import { UploadFileCommand } from '../use-cases/upload-file.use-case';
import { UploadPostImageCommand } from '../use-cases/upload-post-image.use-case';
import { UploadProfileImageCommand } from '../use-cases/upload-profile-image.use-case';

@Injectable()
export class FilesApiService extends BaseEventsApiService<
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
