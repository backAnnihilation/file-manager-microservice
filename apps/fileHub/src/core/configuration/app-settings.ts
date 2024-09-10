import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { INestApplication, INestMicroservice } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@shared/environment.enum';
import { AppModule } from '../../app.module';
import { EnvironmentVariables } from './configuration';
import { exceptionFilterSetup } from './exception-filter.setup';
import { pipesSetup } from './pipes.setup';
import { swaggerSetup } from './swagger.setup';

export const applyAppSettings = (app: INestApplication | INestMicroservice) => {
  const currentENV = app.get(ConfigService<EnvironmentVariables>).get('ENV');
  console.log({ currentENV });

  // let appPrefix = 'api/v1';
  // currentENV === Environment.TESTING && (appPrefix = '');
  // app.setGlobalPrefix(appPrefix);
  // app.enableCors();
  pipesSetup(app);
  // swaggerSetup(app);
  exceptionFilterSetup(app, currentENV);
  // app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
