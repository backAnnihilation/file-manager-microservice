// eslint-disable-next-line import/no-unresolved
import { EVENT_COMMANDS } from '@models/enum/queue-tokens';
// eslint-disable-next-line import/no-unresolved
import { ImageViewModelType } from '@models/file.models';
// eslint-disable-next-line import/no-unresolved
import { Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line import/no-unresolved
import { GetErrors, LayerNoticeInterceptor } from '@shared/notification';
// eslint-disable-next-line import/no-unresolved
import { AxiosAdapter } from '@user/core/adapters/axios.adapter';
// eslint-disable-next-line import/no-unresolved
import { RMQAdapter } from '@user/core/adapters/rmq.adapter';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line import/no-unresolved
import { FileFormat, ImageType } from '../../api/models/enum/file-format.enums';
// eslint-disable-next-line import/no-unresolved,@typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line import/no-unresolved
import { UploadFileDto } from '../../api/models/input/upload-file-type.model';

// eslint-disable-next-line import/no-unresolved
import { ProfilesRepository } from './profiles.repository';

@Injectable()
export class PostImageService {
  constructor(
    private resendAdapter: AxiosAdapter,
    private profilesRepo: ProfilesRepository,
    private rmqAdapter: RMQAdapter,
  ) {}

  async uploadProfilePhoto(
    uploadFileDto: UploadFileDto,
  ): Promise<ImageViewModelType> {
    const { image, userId } = uploadFileDto;
    const profile = await this.profilesRepo.getByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    const imageToUpload = {
      fileFormat: FileFormat.IMAGE,
      fileType: ImageType.MAIN,
      image,
    };
    const url = `/${profile.id}/upload`;
    return await this.resendAdapter.sendPostRequest(url, imageToUpload);
  }

  async uploadProfileImage(
    uploadFileDto: UploadFileDto,
  ): Promise<LayerNoticeInterceptor<ImageViewModelType>> {
    const notice = new LayerNoticeInterceptor<ImageViewModelType>();
    const { image, userId } = uploadFileDto;
    const profile = await this.profilesRepo.getByUserId(userId);
    if (!profile) {
      notice.addError(
        `Profile wasn't found`,
        'uploadImage',
        GetErrors.NotFound,
      );
      return notice;
    }

    const imagePayload = {
      fileFormat: FileFormat.IMAGE,
      fileType: ImageType.MAIN,
      image,
      profileId: profile.id,
    };

    const commandName = EVENT_COMMANDS.PHOTO_UPLOAD;
    const result = await this.rmqAdapter.sendMessage(imagePayload, commandName);

    if (!result) {
      notice.addError(
        `Image wasn't uploaded`,
        'uploadImage',
        GetErrors.NotCreated,
      );
      return notice;
    }

    notice.addData(result);
    return notice;
  }
}
