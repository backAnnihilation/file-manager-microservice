import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendRecoveryMsgCommand } from './commands/send-recovery-msg.command';
import { EmailManager } from '../../../../../core/managers/email-manager';

@CommandHandler(SendRecoveryMsgCommand)
export class SendRecoveryMsgUseCase
  implements ICommandHandler<SendRecoveryMsgCommand>
{
  constructor(private emailManager: EmailManager) {}

  async execute(command: SendRecoveryMsgCommand) {
    return this.emailManager.sendEmailRecoveryMessage(
      command.recoveryDto.email,
      command.recoveryDto.recoveryCode,
    );
  }
}
