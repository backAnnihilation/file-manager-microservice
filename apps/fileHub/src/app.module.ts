import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationModule } from './core/configuration/app-config.module';
import { DatabaseModule } from './core/db/database.module';
import { schemas } from './core/db/schemas';
import { UploadFileUseCase } from './features/profile/application/use-cases/upload-file.use-case';
import { FilesRepository } from './features/profile/infrastructure/files.repository';
import { FilesController } from './features/profile/api/files.controller';
import { ApiKeyGuard } from './features/profile/infrastructure/guards/api-key.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { FilesScheduleService } from './features/profile/application/services/file-metadata.schedule.service';
import { FilesStorageAdapter } from './core/adapters/local-files-storage.adapter';
import { FileExtractPipe } from './features/profile/infrastructure/pipes/extract-file-characters.pipe';
import { FilesService } from './features/profile/application/services/file-metadata.service';
import { S3FilesStorageAdapter } from './core/adapters/s3-files-storage.adapter';
import { FilesBaseApiService } from './features/profile/application/services/file.base.service';
import { FilesQueryRepository } from './features/profile/api/files.query.repository';

@Module({
  imports: [
    ConfigurationModule,
    CqrsModule,
    DatabaseModule,
    MongooseModule.forFeature(schemas),
    ScheduleModule.forRoot(),
  ],
  controllers: [FilesController],
  providers: [
    FilesRepository,
    UploadFileUseCase,
    ApiKeyGuard,
    FilesScheduleService,
    FileExtractPipe,
    FilesService,
    FilesBaseApiService,
    FilesQueryRepository,
    {
      provide: FilesStorageAdapter,
      useClass: S3FilesStorageAdapter,
    },
  ],
})
export class AppModule {}
