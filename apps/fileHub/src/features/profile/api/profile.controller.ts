import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../../../../user/src/features/auth/infrastructure/guards/accessToken.guard';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiTagsEnum,
  RoutingEnum,
} from '../../../../../../libs/shared/routing';
import { ProfileNavigate } from '../../../core/routes/profile-navigate';
import { UserSessionDto } from '../../../../../user/src/features/security/api/models/security-input.models/security-session-info.model';
import { UserPayload } from '../../../../../user/src/features/auth/infrastructure/decorators/user-payload.decorator';
import { UpdateProfileDto } from './models/input-models/fill-profile.model';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserProfile,
  UserProfileModel,
} from '../../../core/db/domain/user-profile.schema';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateProfileCommand } from '../application/use-cases/update-profile.use-case';

@ApiTags(ApiTagsEnum.Profiles)
@Controller(RoutingEnum.profiles)
export class ProfileController {
  constructor(
    private commandBus: CommandBus
  ) {}

  // @UseGuards(AccessTokenGuard)
  @Put(ProfileNavigate.UpdateProfile)
  async updateProfile(
    // @UserPayload() userPayload: UserSessionDto,
    @Body() profileDto: UpdateProfileDto,
  ) {
    const command = new UpdateProfileCommand(profileDto);
    const res = await this.commandBus.execute(command)
    return res.data;
  }
}
