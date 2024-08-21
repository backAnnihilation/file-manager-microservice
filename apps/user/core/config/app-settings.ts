import { swaggerSetup } from './swagger.setup';
import { AppModule } from '../../src/app.module';
import { useContainer } from 'class-validator';
import { pipesSetup } from './pipes.setup';
import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { exceptionFilterSetup } from './exception-filter.setup';

export const applyAppSettings = (app: INestApplication) => {
  pipesSetup(app);
  swaggerSetup(app);
  exceptionFilterSetup(app);
  app.use(cookieParser());
  // app.setGlobalPrefix('api/v1');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
