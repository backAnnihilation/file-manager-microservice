import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

import { validate } from './configuration';

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
