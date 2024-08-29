import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BcryptAdapter } from '../../../../../core/adapters/bcrypt.adapter';
import {
  LayerNoticeInterceptor,
} from '../../../../../core/utils/notification';
import { UsersRepository } from '../../../admin/infrastructure/users.repo';
import { UserModelDTO } from '../../../admin/application/dto/create-user.dto';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { CreateUserExternalCommand } from './commands/create-userexternal.command';
const crypto = require('crypto');


@CommandHandler(CreateUserExternalCommand)
export class CreateUserExternalUseCase implements ICommandHandler<CreateUserExternalCommand> {
  private location = this.constructor.name;
  constructor(
    private usersRepo: UsersRepository,
    private bcryptAdapter: BcryptAdapter,
    private authRepo: AuthRepository,
    private eventBus: EventBus
  ) {}

  async execute(
    command: CreateUserExternalCommand
  ): Promise<any> {

    const { email, userName } = command.createDto;
    const notice = new LayerNoticeInterceptor<any>();

    const existedUser = await this.authRepo.findExistedUserByEmailOrName({
      userName,
      email,
    });

  if (existedUser) {
    notice.addData({ userId: existedUser.id });
    return notice;
  }


  const password = crypto.randomBytes(8).toString('hex');

    const { passwordHash } = await this.bcryptAdapter.createHash(password.toString());

    const isConfirmed = true;
    const userDto = new UserModelDTO(
      userName,
      email,
      passwordHash,
      isConfirmed
    );

    const result = await this.usersRepo.save(userDto);
    notice.addData({ userId: result.id });

    return notice;
  }
}
