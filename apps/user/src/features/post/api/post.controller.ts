import { FileType } from '@models/file.models';
import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiTagsEnum, RoutingEnum } from '@shared/routing';
import { UserNavigate } from '@user/core/routes/user-navigate';
import { UserPayload } from '../../auth/infrastructure/decorators/user-payload.decorator';
import { AccessTokenGuard } from '../../auth/infrastructure/guards/accessToken.guard';
import { UserSessionDto } from '../../security/api/models/security-input.models/security-session-info.model';



@ApiTags(ApiTagsEnum.Posts)
@Controller(RoutingEnum.posts)
export class PostsController {
  constructor() // private commandBus: CommandBus,
  // private userProfilesApiService: UserProfilesApiService,
  // private profilesQueryRepo: ProfilesQueryRepo,
  // private profileService: UserProfileService,
  {}

  @Get(UserNavigate.GetProfile)
  async getUserProfile(@Param('id') profileId: string): Promise<any> {
    // const profile = await this.profilesQueryRepo.getById(profileId);
    // if (!profile) {
    //   throw new NotFoundException('Profile not found');
    // }
    // return profile;
  }

  // @HttpCode(HttpStatus.NO_CONTENT)
  @Post()
  @UseGuards(AccessTokenGuard)
  async uploadProfilePhoto(
    @UserPayload() userPayload: UserSessionDto,
    image: FileType,
  ): Promise<any> {
    // return this.profileService.uploadProfilePhoto({
    //   image,
    //   userId: userPayload.userId,
    // });
  }
}
