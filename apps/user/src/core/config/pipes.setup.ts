import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

import { validationErrorsMapper } from '../validation/validation-utils';

import { swaggerSetup } from './swagger/swagger.setup';

export const pipesSetup = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory(errors: ValidationError[]) {
        const customErrors: ValidationPipeErrorType[] =
          validationErrorsMapper.mapValidationErrorToValidationPipeErrorTArray(
            errors,
          );

        throw new BadRequestException(customErrors);
      },
    }),
  );
  swaggerSetup(app);
};

export type ValidationPipeErrorType = {
  field: string;
  message: string;
};
