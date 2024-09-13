import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ImageViewModelType } from '@models/file.models';

import {
  FileMeta,
  FileMetaDocument,
  FileMetaModel,
} from '../domain/entities/file-meta.schema';

@Injectable()
export class FilesQueryRepository {
  constructor(@InjectModel(FileMeta.name) private fileModel: FileMetaModel) {}

  async getById(fileId: string) {
    try {
      const result = await this.fileModel.findById(fileId);
      if (!result) return null;
      return this.fileToViewModel(result);
    } catch (error) {
      console.error(`Database fails operate during the find blog`, error);
      return null;
    }
  }

  private fileToViewModel = (file: FileMetaDocument): ImageViewModelType => ({
    id: file._id.toString(),
    url: file.fileUrl,
    profileId: file.profileId,
    createdAt: file.createdAt.toString(),
  });
}
