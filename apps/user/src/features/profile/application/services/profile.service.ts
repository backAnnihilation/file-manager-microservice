import { Injectable, NotFoundException } from '@nestjs/common';
import { AxiosAdapter } from '@user/core/adapters/axios.adapter';
import { FileType, ImageViewModelType } from '@models/file.models';
import * as sharp from 'sharp';

import { FileFormat, ImageType } from '../../api/models/enum/file-format.enums';
import { UploadFileDto } from '../../api/models/input/upload-file-type.model';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';

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

    const convertedImageBuffer = await this.convertPhotoToStorageFormat(image);
    const imageToUpload = {
      ...image,
      buffer: convertedImageBuffer,
    };

    const fileToUpload = {
      fileFormat: FileFormat.IMAGE,
      fileType: ImageType.MAIN,
      image: imageToUpload,
    };
    const url = `/${profile.id}/upload`;
    return await this.resendAdapter.sendPostRequest(url, fileToUpload);
  }

  private convertPhotoToStorageFormat = async (
    image: FileType,
  ): Promise<Buffer> =>
    await sharp(image.buffer).webp({ quality: 80 }).toBuffer();
}
