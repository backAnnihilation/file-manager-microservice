import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserIdType } from '../../../admin/api/models/outputSA.models.ts/user-models';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { VerificationCredentialsCommand } from './commands/verification-credentials.command';
import { BcryptAdapter } from '../../../../../core/adapters/bcrypt.adapter';
import { LayerNoticeInterceptor, GetErrors } from '../../../../../core/utils/notification';

@CommandHandler(VerificationCredentialsCommand)
export class VerificationCredentialsUseCase
  implements ICommandHandler<VerificationCredentialsCommand>
{
  private readonly location: string;
  constructor(
    private authRepo: AuthRepository,
    private bcryptAdapter: BcryptAdapter,
  ) {
    this.location = this.constructor.name;
  }

  async execute(
    command: VerificationCredentialsCommand,
  ): Promise<LayerNoticeInterceptor<UserIdType | null>> {
    const notice = new LayerNoticeInterceptor<UserIdType>();
    const { loginOrEmail, password } = command.verificationDto;

    const userAccount = await this.authRepo.findByLoginOrEmail({
      loginOrEmail,
    });

    if (!userAccount) {
      notice.addError('User not found', this.location, GetErrors.NotFound);
      return notice;
    }

    const user = await this.authRepo.getUserBanInfo(userAccount.id);
    if (user?.isBanned) {
      notice.addError(
        `User with loginOrEmail ${loginOrEmail} is banned`,
        this.location,
        GetErrors.DeniedAccess,
      );
      return notice;
    }

    const validPassword = await this.bcryptAdapter.compareAsync(
      password,
      userAccount.passwordHash,
    );

    if (validPassword) {
      notice.addData({ userId: userAccount.id });
    } else {
      notice.addError(
        'Incorrect password',
        this.location,
        GetErrors.IncorrectPassword,
      );
    }

    return notice;
  }
}
