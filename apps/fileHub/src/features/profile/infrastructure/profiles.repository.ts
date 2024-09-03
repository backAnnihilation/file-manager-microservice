import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FileMeta,
  FileMetaDocument,
  FileMetaModel,
} from '../domain/entities/file-meta.schema';

@Injectable()
export class FilesRepository {
  constructor(@InjectModel(FileMeta.name) private fileModel: FileMetaModel) {}

  async save(fileDto: FileMetaDocument): Promise<FileMetaDocument> {
    try {
      return await fileDto.save();
    } catch (error) {
      console.log(`failed save profile`);
      throw new Error(error);
    }
  }

  async getById(fileId: string): Promise<any> {
    try {
      const result = await this.fileModel.findById(fileId).lean();

      if (!result) return null;

      return result;
    } catch (error) {
      console.error(`Database fails operate during the find blog`, error);
      return null;
    }
  }
}
