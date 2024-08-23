import { UserRecoveryType } from '../../api/models/auth.output.models/auth.output.models';
import { CreateTemporaryAccountCommand } from './commands/create-temp-account.command';
import { SendRecoveryMsgCommand } from './commands/send-recovery-msg.command';
import { createRecoveryCode } from '../helpers/create-recovery-message.helper';
import { AuthRepository } from '../../infrastructure/auth.repository';
import {
  CommandHandler,
  ICommandHandler,
  CommandBus,
  EventBus,
} from '@nestjs/cqrs';
import { OutputId } from '../../../../../core/api/dto/output-id.dto';
import { SendRecoveryMessageEvent } from './send-recovery-msg.event';

@CommandHandler(CreateTemporaryAccountCommand)
export class CreateTemporaryAccountUseCase
  implements ICommandHandler<CreateTemporaryAccountCommand>
{
  constructor(
    private authRepo: AuthRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: CreateTemporaryAccountCommand): Promise<OutputId> {
    const { email } = command.createDto;
    const recoveryPassInfo: UserRecoveryType = createRecoveryCode();

    const tempAccountDto = {
      email,
      recoveryCode: recoveryPassInfo.recoveryCode,
      expirationDate: recoveryPassInfo.expirationDate,
    };

    const temporaryUserAccount =
      await this.authRepo.createTemporaryUserAccount(tempAccountDto);

    const event = new SendRecoveryMessageEvent({
      email,
      recoveryCode: recoveryPassInfo.recoveryCode,
    });

    this.eventBus.publish(event);

    return temporaryUserAccount!;
  }
}

export class TempUserAccountDTO {
  private recoveryCode: string;
  private recoveryDate: Date;
  constructor(
    public email: string,
    public recoveryData: UserRecoveryType,
  ) {
    this.recoveryCode = recoveryData.recoveryCode;
    this.recoveryDate = recoveryData.expirationDate;
  }
}
