import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { UnauthorizedViaTokenApiResponse } from './shared/authorization.response';

export const GetProfileEndpoint = () =>
  applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      type: UserProfileResponseDto,
      description: 'Success - User profile retrieved successfully',
    }),
    UnauthorizedViaTokenApiResponse(),
    ApiBearerAuth('accessToken'),
  );

export class UserProfileResponseDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  userName: string;
  @ApiProperty()
  userId: string;
}
