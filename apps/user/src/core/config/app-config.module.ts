import { ConfigModule } from '@nestjs/config';
import { validate } from './configuration';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      cache: true,
      expandVariables: true,
      // envFilePath: 'apps/user/.env',
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
