import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UnauthorizedApiResponse } from './shared/authorization.response';
import { AccessTokenResponseDto } from './shared/accessToken-response.dto';

export const RefreshTokenEndpoint = () =>
  applyDecorators(
    ApiResponse({ status: HttpStatus.OK, type: AccessTokenResponseDto }),
    UnauthorizedApiResponse(),
    ApiBearerAuth(),
  );
