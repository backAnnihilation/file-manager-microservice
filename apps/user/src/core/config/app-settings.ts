import { swaggerSetup } from './swagger/swagger.setup';
import { AppModule } from '../../app.module';
import { useContainer } from 'class-validator';
import { pipesSetup } from './pipes.setup';
import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { exceptionFilterSetup } from './exception-filter.setup';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './configuration';
import { Environment } from '@shared/environment.enum';

export const applyAppSettings = (app: INestApplication) => {
  const currentENV = app.get(ConfigService<EnvironmentVariables>).get('ENV');

  // currentENV !== Environment.TESTING && app.setGlobalPrefix('api/v1');
  const corsSetup = {
    origin: [/localhost(:\d+)?$/],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  };
  app.enableCors(corsSetup);
  pipesSetup(app);
  swaggerSetup(app);
  exceptionFilterSetup(app, currentENV);
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
