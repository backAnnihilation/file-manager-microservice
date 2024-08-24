import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OutputId } from '../../../../../core/api/dto/output-id.dto';
import {
  LayerNoticeInterceptor,
  GetErrors,
} from '../../../../../core/utils/notification';
import { UserSessionDTO } from '../../../auth/api/models/dtos/user-session.dto';
import { SecurityRepository } from '../../infrastructure/security.repository';
import { CreateSessionCommand } from './commands/create-session.command';

@CommandHandler(CreateSessionCommand)
export class CreateUserSessionUseCase
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(private securityRepo: SecurityRepository) {}

  async execute(
    command: CreateSessionCommand,
  ): Promise<LayerNoticeInterceptor<OutputId | null>> {
    const notice = new LayerNoticeInterceptor<OutputId>();

    const {
      ipAddress,
      browser,
      deviceType,
      refreshToken,
      userId,
      userPayload,
    } = command.inputData;

    const sessionDto = new UserSessionDTO(
      ipAddress,
      `Device type: ${deviceType}, Application: ${browser}`,
      userId,
      userPayload,
      refreshToken,
    );

    const result = await this.securityRepo.createSession(sessionDto);

    if (!result) {
      notice.addError('Session not created', 'db', GetErrors.NotCreated);
      return notice;
    } else {
      notice.addData({ id: result.id });
    }

    return notice;
  }
}
