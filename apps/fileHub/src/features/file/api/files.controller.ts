import { ProfileNavigate } from '@file/core/routes/profile-navigate';
import {
  ApiTagsEnum,
  ImageCategory,
  ImageType,
  IProfileImageViewModelType,
  MediaType,
  RmqService,
  RoutingEnum,
  UPLOAD_FILE,
  UPLOAD_PHOTO,
} from '@app/shared';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { FilesBaseApiService } from '../application/services/file.base.service';
import { UploadFileCommand } from '../application/use-cases/upload-file.use-case';
import { ApiKeyGuard } from '../infrastructure/guards/api-key.guard';
import { FileExtractPipe } from '../infrastructure/pipes/extract-file-characters.pipe';
import { UploadProfileImageCommand } from '../application/use-cases/upload-profile-image.use-case';
import {
  FileExtractedType,
  InputFileTypesDto,
} from './models/input-models/extracted-file-types';
import { InputProfileImageDto } from './models/input-models/profile-image.model';
import { UploadPostImageCommand } from '../application/use-cases/upload-post-image.use-case';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostImageMeta,
  PostImageMetaModel,
} from '../domain/entities/post-image-meta.schema';
import { PostImageMetaDto } from '../domain/entities/post-image-meta.schema';
import { InputPostImageDto } from './models/input-models/post-image.model';

@ApiTags(ApiTagsEnum.Files)
@Controller(RoutingEnum.files)
export class FilesController {
  constructor(
    @InjectModel(PostImageMeta.name) private PostModel: PostImageMetaModel,
    private commandBus: CommandBus,
    private filesApiService: FilesBaseApiService,
    private readonly rmqService: RmqService,
  ) {}

  @Get('test')
  async testModel() {
    console.log({ start: 1 });

    const notice = await this.PostModel.makeInstance<
      PostImageMetaDto,
      PostImageMeta
    >({
      userId: '1',
      postId: '1',
      storageId: '123',
      name: 'file',
      size: 123,
      category: ImageCategory.PROFILE,
      url: 'url',
    });
    const { data } = notice;
    return data;
  }

  @Post(ProfileNavigate.UploadProfilePhoto)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(ApiKeyGuard)
  async uploadFile(
    @Param('id') profileId: string,
    @Body() fileDto: InputFileTypesDto,
    @UploadedFile(FileExtractPipe) extractedFile: FileExtractedType,
  ): Promise<IProfileImageViewModelType> {
    const command = new UploadFileCommand({
      ...extractedFile,
      ...fileDto,
      profileId,
    });
    return this.filesApiService.create(
      command,
    ) as Promise<IProfileImageViewModelType>;
  }

  @MessagePattern(UPLOAD_PHOTO)
  handleUploadProfileImage(
    @Payload() data?: InputProfileImageDto,
    @Ctx() context?: RmqContext,
  ) {
    this.rmqService.ack(context);
    const command = new UploadProfileImageCommand(data);
    return this.filesApiService.create(command);
  }

  @MessagePattern('POST_CREATED')
  handleUploadPostImage(
    @Payload() data?: InputPostImageDto,
    @Ctx() context?: RmqContext,
  ) {
    // this.rmqService.ack(context);
    const command = new UploadPostImageCommand(data);
    return this.filesApiService.create(command);
  }

  @EventPattern('emit')
  handleUploadFile(
    @Payload() data?: InputProfileImageDto,
    @Ctx() context?: RmqContext,
  ) {
    console.log({ data });

    this.rmqService.ack(context);
  }

  @Get()
  get() {
    return 'Hello';
  }
}
