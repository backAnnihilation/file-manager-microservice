import { INestApplication, INestMicroservice } from '@nestjs/common';
import { HttpExceptionFilter } from './exception-filter';

export const exceptionFilterSetup = (
  app: INestApplication | INestMicroservice,
  env: string,
) => {
  app.useGlobalFilters(new HttpExceptionFilter(env));
};
