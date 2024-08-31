import { Module } from '@nestjs/common';
import { ProfileController } from './features/profile/api/profile.controller';
import { ConfigurationModule } from './core/configuration/app-config.module';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from './core/db/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { schemas } from './core/db/schemas';
import { ProfilesRepository } from './features/profile/infrastructure/profiles.repository';
import { UpdateProfileUseCase } from './features/profile/application/use-cases/update-profile.use-case';

@Module({
  imports: [
    ConfigurationModule,
    CqrsModule,
    DatabaseModule,
    MongooseModule.forFeature(schemas),
  ],
  controllers: [ProfileController],
  providers: [UpdateProfileUseCase, ProfilesRepository],
})
export class AppModule {}
