import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenResponseDto {
  @ApiProperty({
    description:
      'Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds).',
    example: 'string',
  })
  accessToken: string;
}

export class ErrorMessageDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Invalid login or password',
  })
  message: string;

  @ApiProperty({
    description: 'Field where the error occurred',
    example: 'loginOrEmail',
  })
  field: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Array of error messages',
    type: [ErrorMessageDto],
  })
  errorsMessages: ErrorMessageDto[];
}

