import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BcryptAdapter } from '../../../../../core/adapters/bcrypt.adapter';
import { LayerNoticeInterceptor } from '../../../../../core/utils/notification';
import { UserIdType } from '../../../admin/api/models/outputSA.models.ts/user-models';
import { UsersRepository } from '../../../admin/infrastructure/users.repo';
import { CreateUserCommand } from './commands/create-user.command';
import { UserModelDTO } from '../../../admin/application/dto/create-user.dto';
import { EmailNotificationEvent } from './events/email-notification-event';

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private usersRepo: UsersRepository,
    private bcryptAdapter: BcryptAdapter,
    private eventBus: EventBus,
  ) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<LayerNoticeInterceptor<UserIdType> | null> {
    const { email, userName, password } = command.createDto;

    const notice = new LayerNoticeInterceptor<any>();

    const { passwordHash } = await this.bcryptAdapter.createHash(password);

    const isConfirmed = false;
    const userDto = new UserModelDTO(
      userName,
      email,
      passwordHash,
      isConfirmed,
    );
    const unconfirmedUserTheSameEmail =
      await this.usersRepo.getUnconfirmedUserByEmail(email);

    if (unconfirmedUserTheSameEmail) {
      await this.usersRepo.deleteUser(unconfirmedUserTheSameEmail.id);
    }

    const result = await this.usersRepo.save(userDto);

    const event = new EmailNotificationEvent(email, userDto.confirmationCode);
    this.eventBus.publish(event);

    notice.addData({ userId: result.id });

    return notice;
  }
}
