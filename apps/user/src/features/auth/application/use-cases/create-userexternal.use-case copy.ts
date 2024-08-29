import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BcryptAdapter } from '../../../../../core/adapters/bcrypt.adapter';
import {
  GetErrors,
  LayerNoticeInterceptor,
} from '../../../../../core/utils/notification';
import { UserIdType } from '../../../admin/api/models/outputSA.models.ts/user-models';
import { UsersRepository } from '../../../admin/infrastructure/users.repo';
import { CreateUserCommand } from './commands/create-user.command';
import { UserModelDTO } from '../../../admin/application/dto/create-user.dto';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { EmailNotificationEvent } from './events/email-notification-event';
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

    const { email } = command.createDto;
    const notice = new LayerNoticeInterceptor<any>();

    let userName = ''
    const existedUser = await this.authRepo.findExistedUserByEmailOrName({
      userName,
      email,
    });

  if (existedUser) {
    notice.addData({ userId: existedUser.id });
    return notice;
  }

    function generateRandomNickname(): string {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      const nicknameLength = Math.floor(Math.random() * (30 - 6 + 1)) + 6;
      let result = '';

      for (let i = 0; i < nicknameLength; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters[randomIndex];
      }

      return result;
    }

    userName = generateRandomNickname();

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
