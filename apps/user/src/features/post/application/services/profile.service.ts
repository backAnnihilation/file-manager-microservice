import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from '@user/core/adapters/axios.adapter';
import { FileType } from '@models/file.models';

@Injectable()
export class UserPostService {
  constructor(private resendAdapter: AxiosAdapter) {}

  async uploadProfilePhoto(uploadFileDto: UploadFileDto): Promise<void> {
    const { image, userId } = uploadFileDto;
    const url = `/${userId}/upload`;
    // await this.resendAdapter.sendPostRequest(url, image);
  }
}

export type UploadFileDto = {
  image: FileType;
  userId: string;
};
