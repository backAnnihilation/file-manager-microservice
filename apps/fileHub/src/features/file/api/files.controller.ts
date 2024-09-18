import { ProfileNavigate } from '@file/core/routes/profile-navigate';
import {
  ApiTagsEnum,
  ImageCategory,
  ImageType,
  IProfileImageViewModelType,
  MediaType,
  POST_CREATED,
  PROFILE_IMAGE,
  RmqService,
  RoutingEnum,
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
    private filesApiService: FilesBaseApiService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(PROFILE_IMAGE)
  handleUploadProfileImage(
    @Payload() data?: InputProfileImageDto,
    @Ctx() context?: RmqContext,
  ) {
    const command = new UploadProfileImageCommand(data);
    return this.filesApiService.handle(command, context);
  }

  @MessagePattern(POST_CREATED)
  handleUploadPostImage(
    @Payload() data?: InputPostImageDto,
    @Ctx() context?: RmqContext,
  ) {
    const command = new UploadPostImageCommand(data);
    return this.filesApiService.handle(command, context);
  }

  @EventPattern('emit')
  handleUploadFile(
    @Payload() data?: InputProfileImageDto,
    @Ctx() context?: RmqContext,
  ) {
    console.log({ data });

    this.rmqService.ack(context);
  }
}
