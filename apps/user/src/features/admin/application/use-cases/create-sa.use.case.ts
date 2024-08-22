import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repo';
import { CreateSACommand } from '../commands/create-sa.command';
import { BcryptAdapter } from '../../../../../core/adapters/bcrypt.adapter';
import {
  LayerNoticeInterceptor,
  GetErrors,
} from '../../../../../core/utils/notification';
import { ResponseIdType } from '../../api/models/outputSA.models.ts/user-models';
import { UserModelDto } from '../dto/create-user.dto';

@CommandHandler(CreateSACommand)
export class CreateSAUseCase implements ICommandHandler<CreateSACommand> {
  constructor(
    private bcryptAdapter: BcryptAdapter,
    private usersRepo: UsersRepository,
  ) {}

  async execute(
    command: CreateSACommand,
  ): Promise<LayerNoticeInterceptor<ResponseIdType>> {
    let notice = new LayerNoticeInterceptor<ResponseIdType>();

    const { email, userName, password } = command.createData;

    const { passwordHash } = await this.bcryptAdapter.createHash(password);

    const isConfirmed = true;
    const userDto = new UserModelDto(
      userName,
      email,
      passwordHash,
      isConfirmed,
    );

    await this.usersRepo.save(userDto);

    return notice;
  }
}
