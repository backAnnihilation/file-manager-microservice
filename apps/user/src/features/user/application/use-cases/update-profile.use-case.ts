import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OutputId } from '../../../../../../../libs/shared/models/output-id.dto';
import { LayerNoticeInterceptor } from '../../../../../../../libs/shared/notification';
import { UsersRepository } from '../../../admin/infrastructure/users.repo';
import { IUpdateProfileCommand } from '../../api/models/input/update-profile.model';
import { UserEntities } from '../../api/models/user-entities.enum';
import { UserProfileDTO } from '../dto/profile.dto';
('../../api/models/input-models/fill-profile.model');

export class UpdateProfileCommand {
  constructor(public profileDto: IUpdateProfileCommand) {}
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileUseCase
  implements ICommandHandler<UpdateProfileCommand>
{
  private location = this.constructor.name;
  constructor(private userRepo: UsersRepository) {}

  async execute(
    command: UpdateProfileCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    let notice = new LayerNoticeInterceptor<any>();
    const { userId } = command.profileDto;
    const { userName } = await this.userRepo.getUserById(userId);

    const profileDto = new UserProfileDTO({
      ...command.profileDto,
      userName,
    });

    const result = await this.userRepo.saveEntity(
      UserEntities.UserProfile,
      profileDto,
    );

    notice.addData({ id: result.id });
    return notice;
  }
}
