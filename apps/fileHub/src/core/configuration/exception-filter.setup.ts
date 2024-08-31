import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from './exception-filter';

export const exceptionFilterSetup = (app: INestApplication, env: string) => {
  app.useGlobalFilters(new HttpExceptionFilter(env));
};
