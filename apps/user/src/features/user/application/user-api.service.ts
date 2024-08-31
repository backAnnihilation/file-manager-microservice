import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BaseCUDApiService } from '../../../../core/api/services/base-cud-api.service';
import { UserProfileViewModel } from '../api/models/output/profile.view.model';
import { ProfilesQueryRepo } from '../api/query-repositories/profiles.query.repo';
import { UpdateProfileCommand } from './use-cases/update-profile.use-case';

@Injectable()
export class UserProfilesApiService extends BaseCUDApiService<
  UpdateProfileCommand,
  UserProfileViewModel
> {
  constructor(commandBus: CommandBus, queryRepo: ProfilesQueryRepo) {
    super(commandBus, queryRepo);
  }
}
