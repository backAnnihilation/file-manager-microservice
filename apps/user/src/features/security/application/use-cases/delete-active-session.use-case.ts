import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityRepository } from '../../infrastructure/security.repository';
import { DeleteActiveSessionCommand } from './commands/delete-active-session.command';
import { LayerNoticeInterceptor } from '../../../../../core/utils/notification';

@CommandHandler(DeleteActiveSessionCommand)
export class DeleteActiveSessionUseCase
  implements ICommandHandler<DeleteActiveSessionCommand>
{
  constructor(private securityRepo: SecurityRepository) {}

  async execute(command: DeleteActiveSessionCommand): Promise<void> {
    const notice = new LayerNoticeInterceptor();
    return this.securityRepo.deleteSession(command.deleteData.deviceId);
  }
}
