import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationModule } from './core/configuration/app-config.module';
import { DatabaseModule } from './core/db/database.module';
import { schemas } from './core/db/schemas';
import { UploadFileUseCase } from './features/profile/application/use-cases/upload-file.use-case';
import { FilesRepository } from './features/profile/infrastructure/profiles.repository';
import { FilesController } from './features/profile/api/files.controller';
import { ApiKeyGuard } from './features/profile/infrastructure/guards/api-key.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { FilesScheduleService } from './features/profile/application/services/file-metadata.schedule.service';
import { FilesStorageAdapter } from './core/adapters/local-files-storage.adapter';

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
    {
      provide: FilesStorageAdapter,
      useClass: FilesScheduleService,
    },
  ],
})
export class AppModule {}
