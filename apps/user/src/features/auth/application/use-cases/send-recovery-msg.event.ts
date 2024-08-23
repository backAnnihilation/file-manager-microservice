import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailManager } from '../../../../../core/managers/email-manager';
import { SendRecoveryMsgType } from '../../api/models/auth-input.models.ts/password-recovery.types';

export class SendRecoveryMessageEvent {
  constructor(public recoveryPasswordDTO: SendRecoveryMsgType) {}
}

@EventsHandler(SendRecoveryMessageEvent)
export class SendRecoveryMessageEventHandler
  implements IEventHandler<SendRecoveryMessageEvent>
{
  constructor(private readonly emailManager: EmailManager) {}
  async handle(event: SendRecoveryMessageEvent): Promise<void> {
    await this.emailManager.sendEmailRecoveryMessage(
      event.recoveryPasswordDTO.email,
      event.recoveryPasswordDTO.recoveryCode,
    );
  }
}
