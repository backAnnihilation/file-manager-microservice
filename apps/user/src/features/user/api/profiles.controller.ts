import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { FillOutProfileCommand } from '../application/use-cases/fill-out-profile.use-case';
import { FillOutProfileInputModel } from './models/input/fill-out-profile.model';
import { UserProfilesApiService } from '../application/user-api.service';
import { ProfilesQueryRepo } from './query-repositories/profiles.query.repo';
import { UserProfileViewModel } from './models/output/profile.view.model';
import { EditProfileCommand } from '../application/use-cases/edit-profile.use-case';
import { EditProfileInputModel } from './models/input/edit-profile.model';
import { ImageFilePipe } from '../infrastructure/validation/upload-photo-format';
import { FileType } from '../../../../../../libs/shared/models/file.models';
import { AxiosAdapter } from '../../../../core/adapters/axios.adapter';
import { UserProfileService } from '../application/profile.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags(ApiTagsEnum.Profiles)
@Controller(RoutingEnum.profiles)
export class UserProfilesController {
  constructor(
    private commandBus: CommandBus,
    private userProfilesApiService: UserProfilesApiService,
    private profilesQueryRepo: ProfilesQueryRepo,
    private profileService: UserProfileService,
  ) {}

  @Get(UserNavigate.GetProfile)
  async getUserProfile(
    @Param('id') profileId: string,
  ): Promise<UserProfileViewModel> {
    const profile = await this.profilesQueryRepo.getById(profileId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  @Post(UserNavigate.UploadPhoto)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AccessTokenGuard)
  async uploadProfilePhoto(
    @UserPayload() userPayload: UserSessionDto,
    @UploadedFile(ImageFilePipe)
    image: FileType,
  ) {
    return this.profileService.uploadProfilePhoto({
      image,
      userId: userPayload.userId,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post(UserNavigate.FillOutProfile)
  async fillOutProfile(
    @UserPayload() userPayload: UserSessionDto,
    @Body() profileDto: FillOutProfileInputModel,
  ) {
    const command = new FillOutProfileCommand({
      ...profileDto,
      userId: userPayload.userId,
    });
    return this.userProfilesApiService.create(command);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(UserNavigate.EditProfile)
  async editProfile(
    @UserPayload() userPayload: UserSessionDto,
    @Body() profileDto: EditProfileInputModel,
  ) {
    const command = new EditProfileCommand({
      ...profileDto,
      userId: userPayload.userId,
    });
    await this.userProfilesApiService.updateOrDelete(command);
  }
}
