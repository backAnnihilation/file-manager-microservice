import { FilesStorageAdapter } from '@file/core/adapters/local-files-storage.adapter';
import { OutputId } from '@models/output-id.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LayerNoticeInterceptor } from '@shared/notification';
import { ImageType } from '../../api/models/enums/file-details.enum';
import { ContentType } from '../../api/models/output-models/file-output-types';
import {
  CreateFileMetaDto,
  FileMeta,
  FileMetaModel,
} from '../../domain/entities/file-meta.schema';
import { FilesRepository } from '../../infrastructure/files.repository';
import * as sharp from 'sharp';
import { FileType } from '@models/file.models';

@Injectable()
export class FilesService {
  private readonly location: string;
  constructor(
    private readonly filesRepo: FilesRepository,
    private readonly filesAdapter: FilesStorageAdapter,
    @InjectModel(FileMeta.name) private FileMetadata: FileMetaModel,
  ) {
    this.location = this.constructor.name;
  }

  async saveFileMeta(
    fileMetaDto: CreateFileMetaDto,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    try {
      const fileNotice = await this.FileMetadata.makeInstance(fileMetaDto);

      if (fileNotice.hasError) return fileNotice as LayerNoticeInterceptor;

      const result = await this.filesRepo.save(fileNotice.data);
      return new LayerNoticeInterceptor(result);
    } catch (error) {
      throw new Error(`${this.location}: ${error}`);
    }
  }

  generateImageKey = (keyInfo: GenerateImageKeyType) => {
    const { profileId, imageType, contentType, fileName } = keyInfo;
    const [, fileExtension] = contentType.split('/');
    const timeStamp = new Date().getTime();
    const withExtension = fileName.endsWith(fileExtension);
    const fileSignature = withExtension ? fileName.split('.')[0] : fileName;

    const generatedKey = `images/users/profiles/${imageType}/profileId-${profileId}/${fileSignature}${timeStamp}.${fileExtension}`;

    return { Key: generatedKey, ContentType: contentType };
  };

  convertPhotoToStorageFormat = async (image: FileType): Promise<Buffer> =>
    await sharp(image.buffer).webp({ quality: 80 }).toBuffer();
}

type GenerateImageKeyType = {
  fileName: string;
  contentType: ContentType;
  imageType: ImageType;
  profileId: string;
};
