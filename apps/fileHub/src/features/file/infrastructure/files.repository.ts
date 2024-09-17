import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostImageMeta,
  PostImageMetaDocument,
  PostImageMetaModel,
} from '../domain/entities/post-image-meta.schema';
import { BaseFileMetaDocument } from '../domain/entities/base-image-meta.schema';
import { OutputId, OutputIdAndUrl } from '@app/shared';

@Injectable()
export class FilesRepository {
  constructor(
    @InjectModel(PostImageMeta.name) private postFileModel: PostImageMetaModel,
  ) {}

  async save<T extends BaseFileMetaDocument>(fileDto: T): Promise<OutputId> {
    try {
      const result = await fileDto.save();
      return { id: result._id.toString() };
    } catch (error) {
      console.log(`failed save profile`);
      throw new Error(error);
    }
  }
  async savePostFIle(
    postFileDto: PostImageMetaDocument,
  ): Promise<OutputIdAndUrl> {
    try {
      const result = await postFileDto.save();
      return { id: result._id.toString(), url: result.fileUrl };
    } catch (error) {
      console.log(`failed save profile`);
      throw new Error(error);
    }
  }

  async getById(fileId: string): Promise<any> {
    try {
      const result = await this.postFileModel.findById(fileId).lean();

      if (!result) return null;

      return result;
    } catch (error) {
      console.error(`Database fails operate during the find blog`, error);
      return null;
    }
  }

  getModel() {}
}
