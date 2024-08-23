import {
  CommandHandler,
  EventBus,
  ICommandHandler
} from '@nestjs/cqrs';
import { UserRecoveryType } from '../../api/models/auth.output.models/auth.output.models';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { createRecoveryCode } from '../helpers/create-recovery-message.helper';
import { PasswordRecoveryCommand } from './commands/recovery-password.command';
import { SendRecoveryMessageEvent } from './send-recovery-msg.event';

@CommandHandler(PasswordRecoveryCommand)
export class RecoveryPasswordUseCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private eventBus: EventBus,
    private authRepo: AuthRepository,
  ) {}

  async execute(command: PasswordRecoveryCommand): Promise<boolean> {
    const recoveryPassInfo: UserRecoveryType = createRecoveryCode();
    const { email } = command.recoveryDto;

    const updateRecoveryCode = await this.authRepo.updateRecoveryCode(
      email,
      recoveryPassInfo,
    );

    if (!updateRecoveryCode) return false;

    const event = new SendRecoveryMessageEvent({
      email,
      recoveryCode: recoveryPassInfo.recoveryCode,
    });

    this.eventBus.publish(event);

    return updateRecoveryCode;
  }
}
