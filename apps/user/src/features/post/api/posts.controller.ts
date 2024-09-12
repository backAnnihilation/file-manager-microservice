import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiTagsEnum,
  RoutingEnum,
} from '../../../../../../libs/shared/routing';
import { UserPayload } from '../../auth/infrastructure/decorators/user-payload.decorator';
import { AccessTokenGuard } from '../../auth/infrastructure/guards/accessToken.guard';
import { UserSessionDto } from '../../security/api/models/security-input.models/security-session-info.model';
import { EditPostCommand } from '../application/use-cases/edit-post.use-case';
import { UserPostApiService } from '../application/services/user-api.service';
import { DeletePostCommand } from '../application/use-cases/delete-post.use-case';
import { CreatePostCommand } from '../application/use-cases/create-post.use-case';
import { ImagePhotoPipe } from '../infrastructure/validation/create-post-photo';

import { PostQueryRepo } from './query-repositories/post.query.repo';
import { EditPostInputModel } from './models/input/edit-profile.model';
import { CreatePostInputModel } from './models/input/create-post.model';
import { UserPostViewModel } from './models/output/post.view.model';

// декораторы для свагера
@ApiTags(ApiTagsEnum.Posts)
@Controller(RoutingEnum.posts)
export class UserPostsController {
  constructor(
    private commandBus: CommandBus,
    private UserPostApiService: UserPostApiService,
    private postQueryRepo: PostQueryRepo,
    // private profileService: UserProfileService,
  ) {}

  // по айди пользователя получить все его посты (доступно всем незареганым пользователям)
  // 8шт, авторизированный может получать частями по 8постов через скролл
  @Get(':userId')
  async getUserPosts(
    @Param(':userId') userId: string,
  ): Promise<UserPostViewModel[] | null> {
    return await this.postQueryRepo.getUsersPosts(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('photo'))
  async createPost(
    @UserPayload() userPayload: UserSessionDto,
    @Body() createPostDto: CreatePostInputModel,
    @UploadedFile(new ImagePhotoPipe()) file: Express.Multer.File,
  ) {
    const command = new CreatePostCommand({
      ...createPostDto,
      photo: file,
      userId: userPayload.userId,
    });

    return this.UserPostApiService.updateOrDelete(command);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updatePost(
    @UserPayload() userPayload: UserSessionDto,
    @Body() editPostDto: EditPostInputModel,
    @Param('id') postId: string,
  ) {
    const command = new EditPostCommand({
      ...editPostDto,
      userId: userPayload.userId,
      postId,
    });
    return this.UserPostApiService.updateOrDelete(command);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deletePost(
    @Param('id') postId: string,
    @UserPayload() userPayload: UserSessionDto,
  ) {
    const command = new DeletePostCommand({
      userId: userPayload.userId,
      postId,
    });
    return this.UserPostApiService.updateOrDelete(command);
  }
}
