import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { AccessTokenResponseDto } from './shared/accessToken-response.dto';
import { UnauthorizedViaTokenApiResponse } from './shared/authorization.response';

export const RefreshTokenEndpoint = () =>
  applyDecorators(
    ApiResponse({ status: HttpStatus.OK, type: AccessTokenResponseDto }),
    UnauthorizedViaTokenApiResponse(),
    ApiSecurity('refreshToken'),
    // ApiBearerAuth('accessToken'),
  );
