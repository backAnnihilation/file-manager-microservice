import { CommandBus } from '@nestjs/cqrs';
import { IProfileImageViewModelType, RmqService } from '@app/shared';
import { BaseEventsApiService } from '@file/core/api/services/base-events-api.service';
import { ProfilesQueryRepository } from '../../api/profile-image.query.repository';
import { UploadProfileImageCommand } from '../use-cases/upload-profile-image.use-case';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfilesApiService extends BaseEventsApiService<
  UploadProfileImageCommand,
  IProfileImageViewModelType
> {
  constructor(
    rmqService: RmqService,
    commandBus: CommandBus,
    queryRepo: ProfilesQueryRepository,
  ) {
    super(rmqService, commandBus, queryRepo);
  }
}
