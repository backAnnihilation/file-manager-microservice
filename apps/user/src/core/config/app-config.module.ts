import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { validate } from './configuration';
import { rmqConfig } from '@config/rmq.config';
import { Environment } from '@shared/environment.enum';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rmqConfig],
      validate,
      cache: true,
      expandVariables: true,
      envFilePath:
        process.env.ENV === Environment.TESTING ? 'apps/user/.env.testing' : '',
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
