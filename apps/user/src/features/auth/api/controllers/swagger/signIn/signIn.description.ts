import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserCredentialsWithCaptureTokenDto } from '../../../models/auth-input.models.ts/verify-credentials.model';
import { ErrorResponseDto } from '../shared/error-message-response';
import { UnauthorizedApiResponse } from '../shared/authorization.response';
import { AccessTokenResponseDto } from '../shared/accessToken-response.dto';

export const TooManyRequestsApiResponse = () =>
  ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'More than 20 attempts from one IP-address during 20 seconds',
  });

export const CaptureUsing = () =>
  ApiOperation({
    summary: 'User sign-in with reCAPTCHA validation',
    description: 'Sign in user with reCAPTCHA validation to prevent bots.',
  });

export const SignInEndpoint = () =>
  applyDecorators(
    ApiBody({ required: true, type: UserCredentialsWithCaptureTokenDto }),
    ApiResponse({ status: HttpStatus.OK, type: AccessTokenResponseDto }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorResponseDto }),
    UnauthorizedApiResponse(),
    TooManyRequestsApiResponse(),
    CaptureUsing(),
  );
