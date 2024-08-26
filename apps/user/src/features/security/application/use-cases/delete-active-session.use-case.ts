import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityRepository } from '../../infrastructure/security.repository';
import { DeleteActiveSessionCommand } from './commands/delete-active-session.command';
import {
  LayerNoticeInterceptor,
  GetErrors,
} from '../../../../../core/utils/notification';

@CommandHandler(DeleteActiveSessionCommand)
export class DeleteActiveSessionUseCase
  implements ICommandHandler<DeleteActiveSessionCommand>
{
  private location = this.constructor.name;

  constructor(private securityRepo: SecurityRepository) {}

  async execute(
    command: DeleteActiveSessionCommand,
  ): Promise<LayerNoticeInterceptor<void>> {
    const notice = new LayerNoticeInterceptor<void>();

    try {
      const session = await this.securityRepo.getSession(
        command.deleteData.userId,
        command.deleteData.deviceId,
      );

      if (!session) {
        notice.addError(
          `Session with deviceId ${command.deleteData.deviceId} not found`,
          this.location,
          GetErrors.IncorrectModel,
        );
      }

      await this.securityRepo.deleteSession(command.deleteData.deviceId);
    } catch (error) {
      notice.addError(
        `Failed to delete session: ${error.message}`,
        this.location,
        GetErrors.DatabaseFail,
      );
    }

    return notice;
  }
}
