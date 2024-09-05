import { Injectable, NotFoundException } from '@nestjs/common';
import { AxiosAdapter } from '../../../../core/adapters/axios.adapter';
import { FileFormat, ImageType } from '../../api/models/enum/file-format.enums';
import { UploadFileDto } from '../../api/models/input/upload-file-type.model';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { ImageViewModelType } from '@models/file.models';

@Injectable()
export class UserProfileService {
  constructor(
    private resendAdapter: AxiosAdapter,
    private profilesRepo: ProfilesRepository,
  ) {}

  async uploadProfilePhoto(
    uploadFileDto: UploadFileDto,
  ): Promise<ImageViewModelType> {
    const { image, userId } = uploadFileDto;
    const profile = await this.profilesRepo.getByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    const fileToUpload = {
      fileFormat: FileFormat.IMAGE,
      fileType: ImageType.MAIN,
      profileId: profile.id,
      image,
    };
    const url = `/${profile.id}/upload`;
    return await this.resendAdapter.sendPostRequest(url, fileToUpload);
  }
}
