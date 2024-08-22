import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SAViewType } from '../api/models/user.view.models/userAdmin.view-type';
import { UsersQueryRepo } from '../api/query-repositories/users.query.repo';
import { BaseCUDApiService } from '../../../../core/api/services/base-cud-api.service';

@Injectable()
export class SACudApiService<TCommand> extends BaseCUDApiService<
  TCommand,
  SAViewType
> {
  constructor(commandBus: CommandBus, usersQueryRepo: UsersQueryRepo) {
    super(commandBus, usersQueryRepo);
  }
}
