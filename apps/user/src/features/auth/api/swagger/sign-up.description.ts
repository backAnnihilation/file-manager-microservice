import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { PasswordDescription } from './shared/password-description';
import { CaptchaHeader } from '../../../security/api/swagger/shared/captcha-using';
import { TooManyRequestsApiResponse } from '../../../security/api/swagger/shared/too-many-requests-api-response';
import { SingUpErrorResponse } from '../../../security/api/swagger/shared/error-message-response';

export const SignUpEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Sign-up in the system',
      description:
        'Registration in the system. Email with confirmation code will be send to passed email address',
    }),
    ApiBody({ required: true, type: SignUpDto }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'Input data is accepted. Email with confirmation code will be send to passed email address',
    }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, type: SingUpErrorResponse }),
    TooManyRequestsApiResponse(),
    CaptchaHeader(),
    ApiSecurity('captchaToken'),
  );

class SignUpDto {
  @ApiProperty({
    required: true,
    example: 'example@mail.com',
    format: 'Email must be a valid email address',
    description: 'must be unique',
    pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  })
  email: string;

  @PasswordDescription()
  password: string;

  @ApiProperty({
    required: true,
    example: 'Batman',
    minLength: 6,
    maxLength: 30,
    description: 'must be unique',
    format:
      'Username should consist of letters, numbers, underscores, or dashes',
    pattern: '^[a-zA-Z0-9_-]+$',
  })
  userName: string;
}
