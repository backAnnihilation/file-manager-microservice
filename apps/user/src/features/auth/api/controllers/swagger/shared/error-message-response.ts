import { ApiProperty } from "@nestjs/swagger";

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
  