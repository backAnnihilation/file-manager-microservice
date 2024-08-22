import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import {
  LayerNoticeInterceptor,
  GetErrors,
} from '../../../../../core/utils/notification';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { UpdatePassTempAccountCommand } from './commands/update-password-temporary-account.command';
import { CreateUserAccountEvent } from './events/create-user-account-event';

@CommandHandler(UpdatePassTempAccountCommand)
export class UpdatePasswordTemporaryAccountUseCase
  implements ICommandHandler<UpdatePassTempAccountCommand>
{
  constructor(
    private authRepo: AuthRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    command: UpdatePassTempAccountCommand,
  ): Promise<LayerNoticeInterceptor<boolean>> {
    const notice = new LayerNoticeInterceptor<boolean>();

    const { recoveryCode, newPassword } = command.updateDto;

    const temporaryUserAccount =
      await this.authRepo.findTemporaryAccountByRecoveryCode(recoveryCode);

    if (!temporaryUserAccount) {
      notice.addError(
        'temporaryUserAccount not found',
        'findTemporaryAccountByRecoveryCode',
        GetErrors.NotFound,
      );
      return notice;
    }

    const generatedUserName = uuidv4();

    const event = new CreateUserAccountEvent({
      email: temporaryUserAccount.email,
      userName: generatedUserName,
      password: newPassword,
    });

    await this.eventBus.publish(event);

    const result = await this.authRepo.deleteTemporaryUserAccount(recoveryCode);

    if (!result) {
      notice.addError(
        "couldn't delete temp account",
        'deleteTemporaryUserAccount',
        GetErrors.NotFound,
      );
    } else {
      notice.addData(result);
      return notice;
    }
  }
}
