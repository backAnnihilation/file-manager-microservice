import { CommandBus } from '@nestjs/cqrs';
import { ImageViewModelType } from '@models/file.models';
import { Injectable } from '@nestjs/common';

import { BaseCUDApiService } from '../../../../core/api/services/base-cud-api.service';
import { FilesQueryRepository } from '../../api/files.query.repository';
import { UploadFileCommand } from '../use-cases/upload-file.use-case';

@Injectable()
export class FilesBaseApiService extends BaseCUDApiService<
  UploadFileCommand,
  ImageViewModelType
> {
  constructor(commandBus: CommandBus, queryRepo: FilesQueryRepository) {
    super(commandBus, queryRepo);
  }
}
