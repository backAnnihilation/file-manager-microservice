import { EmailManager } from '../../../../../../../core/managers/email-manager';
import { EmailNotificationEvent } from '../email-notification-event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(EmailNotificationEvent)
export class UserCreatedNoticeEventHandler
  implements IEventHandler<EmailNotificationEvent>
{
  constructor(private emailManager: EmailManager) {}
  handle(event: EmailNotificationEvent) {
    this.emailManager.sendEmailConfirmationMessage(
      event.email,
      event.confirmationCode,
    );
  }
}
