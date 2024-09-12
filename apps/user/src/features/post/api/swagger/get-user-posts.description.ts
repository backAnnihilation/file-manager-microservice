import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

export const GetaUserPostsEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get user posts',
      description: 'Get all existing posts of a user by id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success - All posts of specified user',
      type: UserPostsDto,
    }),
  );

export class UserPostsDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Invalid  input data',
    nullable: true,
  })
  message: string;

  @ApiProperty({
    description: 'Field where the error occurred',
    example: 'description',
    nullable: true,
  })
  field: string;
}
