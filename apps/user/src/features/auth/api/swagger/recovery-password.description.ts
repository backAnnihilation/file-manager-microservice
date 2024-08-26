import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { AccessTokenResponseDto } from './shared/accessToken-response.dto';
import { TooManyRequestsApiResponse } from './shared/too-many-requests-api-response';
import { CaptchaHeader } from '../../../security/api/swagger/shared/capture-using';

export const PasswordRecoveryEndpoint = () =>
  applyDecorators(
    ApiBody({ type: RecoveryPasswordBodyDto, required: true }),
    ApiResponse({ status: HttpStatus.OK, type: AccessTokenResponseDto }),
    TooManyRequestsApiResponse(),
    CaptchaHeader()
  );

class RecoveryPasswordBodyDto {
  @ApiProperty({
    required: true,
    example: 'example@mail.com',
    description: 'Email must be a valid email address',
    pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  })
  email: string;
}
