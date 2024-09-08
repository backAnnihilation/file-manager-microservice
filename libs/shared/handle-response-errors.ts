import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { LayerInterceptorExtension, GetErrors } from './notification';

// toDo refactor -> make more flexible
export const handleErrors = (
  code: number,
  extension: LayerInterceptorExtension,
) => {
  const {
    DatabaseFail,
    Forbidden,
    IncorrectModel,
    IncorrectPassword,
    NotCreated,
    NotFound,
    Transaction,
  } = GetErrors;
  const { key, message } = extension;
  const descriptionOrOptions = {
    cause: extension.key,
    description: extension.message,
  };

  const errorObject = {
    message,
    statusCode: code,
    key,
  };

  switch (code) {
    case DatabaseFail || Transaction || NotCreated:
      return {
        error: new InternalServerErrorException(errorObject),
      };
    case NotFound:
      return {
        message: extension.message,
        error: new NotFoundException(errorObject),
      };
    case IncorrectModel:
      return {
        message: extension.message,
        error: new BadRequestException(errorObject),
      };

    case Forbidden:
      return {
        message: extension.message,
        error: new ForbiddenException(errorObject),
      };
    case IncorrectPassword:
      return {
        message: extension.message,
        error: new ForbiddenException(errorObject),
      };
    default:
      return {
        message: 'An unexpected error occurred',
        error: new InternalServerErrorException(errorObject),
      };
  }
};
