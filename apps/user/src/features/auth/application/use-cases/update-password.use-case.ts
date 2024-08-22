import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePasswordCommand } from './commands/update-password.command';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { BcryptAdapter } from '../../../../../core/adapters/bcrypt.adapter';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordUseCase
  implements ICommandHandler<UpdatePasswordCommand>
{
  constructor(
    private authRepo: AuthRepository,
    private bcryptAdapter: BcryptAdapter,
  ) {}

  async execute(command: UpdatePasswordCommand): Promise<boolean> {
    try {
      const { recoveryCode, newPassword } = command.updateDto;

      const { passwordHash, passwordSalt } =
        await this.bcryptAdapter.createHash(newPassword);

      return this.authRepo.updateUserPassword({
        passwordSalt,
        passwordHash,
        recoveryCode,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
