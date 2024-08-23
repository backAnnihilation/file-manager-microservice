import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { AccessTokenResponseDto } from './shared/accessToken-response.dto';
import { CaptureUsing } from './shared/capture-using';
import { TooManyRequestsApiResponse } from './shared/too-many-requests-api-response';

export const PasswordRecoveryEndpoint = () =>
  applyDecorators(
    ApiBody({ type: RecoveryPasswordBodyDto, required: true }),
    ApiResponse({ status: HttpStatus.OK, type: AccessTokenResponseDto }),
    TooManyRequestsApiResponse(),
    CaptureUsing(),
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
