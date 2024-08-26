import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiProperty, ApiResponse } from '@nestjs/swagger';

import { PasswordDescription } from './shared/password-description';
import { TooManyRequestsApiResponse } from './shared/too-many-requests-api-response';

export const ConfirmPasswordEndpoint = () =>
  applyDecorators(
    ApiBody({ required: true, type: ConfirmPasswordDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'If code is valid and new password is accepted',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired',
    }),
    TooManyRequestsApiResponse(),
  );

export class ConfirmPasswordDto {
  @PasswordDescription()
  newPassword: string;

  @ApiProperty({
    description: 'confirmation recovery code',
  })
  recoveryCode: string;
}
