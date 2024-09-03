import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { FileType } from '../../../../../../../libs/shared/models/file.models';
import { OutputId } from '../../../../../../../libs/shared/models/output-id.dto';
import { LayerNoticeInterceptor } from '../../../../../../../libs/shared/notification';
import {
  UserProfile,
  UserProfileModel,
} from '../../domain/entities/user-profile.schema';
import {
  FileMeta,
  FileMetaModel,
} from '../../domain/entities/file-meta.schema';
('../../api/models/input-models/fill-profile.model');

export class UploadFileCommand {
  constructor(public uploadDto: FileType & { userId: string }) {}
}

@CommandHandler(UploadFileCommand)
export class UploadFileUseCase implements ICommandHandler<UploadFileCommand> {
  private location = this.constructor.name;
  constructor(
    @InjectModel(FileMeta.name) private FileMetaModel: FileMetaModel,
  ) {}

  async execute(
    command: UploadFileCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    let notice = new LayerNoticeInterceptor<any>();
    const { userId, ...fileCharacters } = command.uploadDto;
    // const createdProfileNotice = await this.ProfileModel.makeInstance(
    //   command.profileDto,
    // );

    // if (createdProfileNotice.hasError)
    //   return createdProfileNotice as LayerNoticeInterceptor;

    // const userDto = createdProfileNotice.data;

    // const result = await this.profileRepo.save(userDto);

    // notice.addData({ id: result.id });
    return notice;
  }
}
