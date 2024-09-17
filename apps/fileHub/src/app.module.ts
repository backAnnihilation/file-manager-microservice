import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { RmqModule } from '@app/shared';
import { ConfigurationModule } from './core/configuration/app-config.module';
import { providers } from './core/configuration/app-providers';
import { DatabaseModule } from './core/db/database.module';
import { schemas } from './core/db/schemas';
import { FilesController } from './features/file/api/files.controller';

@Module({
  imports: [
    ConfigurationModule,
    CqrsModule,
    DatabaseModule,
    MongooseModule.forFeature(schemas),
    ScheduleModule.forRoot(),
    RmqModule,
  ],
  controllers: [FilesController],
  providers,
})
export class AppModule {}
