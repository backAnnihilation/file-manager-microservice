import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiTagsEnum,
  RoutingEnum,
} from '../../../../../../libs/shared/routing';
import { UserNavigate } from '../../../../core/routes/user-navigate';
import { UserPayload } from '../../auth/infrastructure/decorators/user-payload.decorator';
import { AccessTokenGuard } from '../../auth/infrastructure/guards/accessToken.guard';
import { UserSessionDto } from '../../security/api/models/security-input.models/security-session-info.model';
import { UpdateProfileCommand } from '../application/use-cases/update-profile.use-case';
import { UpdateProfileInputModel } from './models/input/update-profile.model';
import { UserProfilesApiService } from '../application/user-api.service';

@ApiTags(ApiTagsEnum.Users)
@Controller(RoutingEnum.users)
export class UserController {
  constructor(
    private commandBus: CommandBus,
    private userProfilesApiService: UserProfilesApiService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(UserNavigate.UpdateProfile)
  async updateProfile(
    @UserPayload() userPayload: UserSessionDto,
    @Body() profileDto: UpdateProfileInputModel,
  ) {
    const command = new UpdateProfileCommand({
      ...profileDto,
      userId: userPayload.userId,
    });
    await this.userProfilesApiService.updateOrDelete(command);
  }
}
