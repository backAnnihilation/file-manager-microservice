import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { awsConfig, validate } from './configuration';
import { rmqConfig } from '@config/rmq.config';
import { Environment } from '@shared/environment.enum';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig, rmqConfig],
      isGlobal: true,
      validate,
      cache: true,
      expandVariables: true,
      envFilePath:
        // process.env.ENV === Environment.TESTING ?
        'apps/fileHub/.env',
      // : '',
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
