import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from '../core/app-config.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthService } from './features/auth/application/auth.service';
import { AuthQueryRepository } from './features/auth/api/query-repositories/auth.query.repo';
import { SecurityController } from './features/security/api/security.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CaptureAdapter } from '../core/adapters/capture.adapter';
import { SecurityQueryRepo } from './features/security/api/query-repositories/security.query.repo';
import { AuthController } from './features/auth/api/controllers/auth.controller';
import { PrismaModule } from '../core/db/prisma/prisma.module';
import { EmailManager } from '../core/managers/email-manager';
import { EmailAdapter } from '../core/adapters/email.adapter';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule,
    ConfigurationModule,
    CqrsModule,
    PrismaModule,
    ThrottlerModule.forRoot([{ limit: 20, ttl: Math.pow(20, 3) }]),
  ],
  controllers: [AppController, SecurityController, AuthController],
  providers: [
    AppService,
    AuthService,
    AuthQueryRepository,
    CaptureAdapter,
    SecurityQueryRepo,
    EmailManager,
    EmailAdapter,
  ],
})
export class AppModule {}
