import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { awsConfig, validate } from './configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig],
      isGlobal: true,
      validate,
      cache: true,
      expandVariables: true,
      envFilePath: 'fileHub/.env',
      // process.env.ENV === Environment.TESTING ? 'apps/fileHub/.env' : '',
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
