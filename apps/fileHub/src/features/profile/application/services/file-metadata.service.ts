import { Injectable } from '@nestjs/common';
import { LayerNoticeInterceptor } from '@shared/notification';
import { FilesStorageAdapter } from '../../../../core/adapters/local-files-storage.adapter';
import { FilesRepository } from '../../infrastructure/files.repository';
import { ContentType } from '../../api/models/output-models/file-output-types';
import { ImageType } from '../../api/models/enums/file-details.enum';
import {
  CreateFileMetaDto,
  FileMeta,
  FileMetaDocument,
  FileMetaModel,
} from '../../domain/entities/file-meta.schema';
import { InjectModel } from '@nestjs/mongoose';
import { OutputId } from '@models/output-id.dto';

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

    let generatedKey = `images/users/profiles/${imageType}/profileId-${profileId}/${fileSignature}${timeStamp}.${fileExtension}`;

    return { Key: generatedKey, ContentType: contentType };
  };
}

type GenerateImageKeyType = {
  fileName: string;
  contentType: ContentType;
  imageType: ImageType;
  profileId: string;
};
