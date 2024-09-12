import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RmqModule } from '@shared/src';
import { QUEUE_NAME } from '@shared/models/enum/queue-tokens';

import { SecurityController } from './features/security/api/security.controller';
import { ConfigurationModule } from './core/config/app-config.module';
import { AuthController } from './features/auth/api/controllers/auth.controller';
import { PrismaModule } from './core/db/prisma/prisma.module';
import { SAController } from './features/admin/api/controllers/sa.controller';
import { providers } from './core/settings/app-providers';
import { UserProfilesController } from './features/profile/api/profiles.controller';
import { UserPostsController } from './features/post/api/posts.controller';

@Module({
  imports: [
    JwtModule.register({}),
    RmqModule.register({ name: QUEUE_NAME.FILES }),
    ThrottlerModule.forRoot([{ limit: 20, ttl: Math.pow(20, 3) }]),
    PassportModule,
    ConfigurationModule,
    CqrsModule,
    PrismaModule,
  ],
  controllers: [
    SecurityController,
    AuthController,
    SAController,
    UserProfilesController,
    UserPostsController,
  ],
  providers,
})
export class AppModule {}
