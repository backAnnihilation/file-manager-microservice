import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BcryptAdapter } from '../../../../../core/adapters/bcrypt.adapter';
import { LayerNoticeInterceptor } from '../../../../../core/utils/notification';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { UserService } from '../user.service';
import { UpdatePasswordCommand } from './commands/update-password.command';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordUseCase
  implements ICommandHandler<UpdatePasswordCommand>
{
  constructor(
    private authRepo: AuthRepository,
    private bcryptAdapter: BcryptAdapter,
    private userService: UserService,
  ) {}

  async execute(
    command: UpdatePasswordCommand,
  ): Promise<LayerNoticeInterceptor> {
    const notice = new LayerNoticeInterceptor();
    const { recoveryCode, newPassword } = command.updateDto;

    const { passwordHash } = await this.bcryptAdapter.createHash(newPassword);

    const userAccount =
      await this.authRepo.findUserByRecoveryCode(recoveryCode);

    const validateNotification = this.userService.validateUserAccount({
      userAccount,
    });

    if (validateNotification.hasError) return validateNotification;

    await this.authRepo.updateUserPassword({
      userId: userAccount.id,
      passwordHash,
    });

    return notice;
  }
}
