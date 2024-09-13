import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OutputId } from '@models/output-id.dto';

import {
  FileMeta,
  FileMetaDocument,
  FileMetaModel,
} from '../domain/entities/file-meta.schema';

@Injectable()
export class FilesRepository {
  constructor(@InjectModel(FileMeta.name) private fileModel: FileMetaModel) {}

  async save(fileDto: FileMetaDocument): Promise<OutputId> {
    try {
      const result = await fileDto.save();
      return { id: result._id.toString() };
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
