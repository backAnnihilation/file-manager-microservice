import { Storage } from '@file/core/configuration/configuration';
import { Provider } from '@nestjs/common';
import { FilesQueryRepository } from '../../features/file/api/files.query.repository';
import { FilesScheduleService } from '../../features/file/application/services/file-metadata.schedule.service';
import { FilesService } from '../../features/file/application/services/file-metadata.service';
import { FilesBaseApiService } from '../../features/file/application/services/file.base.service';
import { UploadFileUseCase } from '../../features/file/application/use-cases/upload-file.use-case';
import { FilesRepository } from '../../features/file/infrastructure/files.repository';
import { ApiKeyGuard } from '../../features/file/infrastructure/guards/api-key.guard';
import { FileExtractPipe } from '../../features/file/infrastructure/pipes/extract-file-characters.pipe';
import { FilesStorageAdapter } from '../adapters/local-files-storage.adapter';
import { S3FilesStorageAdapter } from '../adapters/s3-files-storage.adapter';
import { UploadProfileImageUseCase } from '../../features/profile/application/use-cases/upload-profile-image.use-case';
import {
  UploadPostImageCommand,
  UploadPostImageUseCase,
} from '../../features/profile/application/use-cases/upload-post-image.use-case';

export const providers: Provider[] = [
  FilesRepository,
  UploadFileUseCase,
  ApiKeyGuard,
  FilesScheduleService,
  FileExtractPipe,
  FilesService,
  FilesBaseApiService,
  FilesQueryRepository,
  UploadProfileImageUseCase,
  UploadPostImageCommand,
  UploadPostImageUseCase,
  {
    provide: FilesStorageAdapter,
    useClass:
      process.env.STORAGE === Storage.S3
        ? S3FilesStorageAdapter
        : FilesStorageAdapter,
  },
];
