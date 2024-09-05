import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class EditProfileCommand {
  constructor() // public profileDto: IEditProfile

  {}
}

@CommandHandler(EditProfileCommand)
export class EditProfileUseCase implements ICommandHandler<EditProfileCommand> {
  private location = this.constructor.name;
  constructor() // private profilesRepo: ProfilesRepository
  {}

  async execute(command: EditProfileCommand) {
    // : Promise<LayerNoticeInterceptor<OutputId>>
    // let notice = new LayerNoticeInterceptor<null | OutputId>();
    // const { userId } = command.profileDto;
    // const userProfile = await this.profilesRepo.getByUserId(userId);
    // if (!userProfile) {
    //   notice.addError(
    //     'profile does not exist',
    //     this.location,
    //     GetErrors.IncorrectModel,
    //   );
    //   return notice;
    // }
    // const profileDto = new EditUserProfileDTO({
    //   ...command.profileDto,
    // });
    // await this.profilesRepo.update(userProfile.id, profileDto);
    // return notice;
  }
}
