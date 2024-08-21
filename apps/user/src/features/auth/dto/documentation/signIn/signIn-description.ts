import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { UserCredentialsWithCaptureTokenDto } from '../../../api/models/auth-input.models.ts/verify-credentials.model';
import {
  ErrorResponseDto,
  AccessTokenResponseDto,
} from './signIn-response.dto';

const UnauthorizedApiResponse = () =>
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'If the password or login is wrong',
  });

const TooManyRequestsApiResponse = () =>
  ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'More than 20 attempts from one IP-address during 20 seconds',
  });

export const SignInEndpoint = () =>
  applyDecorators(
    ApiBody({ type: UserCredentialsWithCaptureTokenDto }),
    ApiResponse({ status: HttpStatus.OK, type: AccessTokenResponseDto }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorResponseDto }),
    UnauthorizedApiResponse(),
    TooManyRequestsApiResponse(),
  );

export const RefreshTokenEndpoint = () =>
  applyDecorators(
    ApiResponse({ status: HttpStatus.OK, type: AccessTokenResponseDto }),
    UnauthorizedApiResponse(),
  );

  export const ConfirmPasswordRecoveryEndpoint = () =>
    applyDecorators(
      ApiBody({ type: UserCredentialsWithCaptureTokenDto }),
      ApiResponse({ status: HttpStatus.OK, type: AccessTokenResponseDto }),
      ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorResponseDto }),
      UnauthorizedApiResponse(),
      TooManyRequestsApiResponse(),
    );
  