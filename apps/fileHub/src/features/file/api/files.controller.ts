import { ProfileNavigate } from '@file/core/routes/profile-navigate';
import { UPLOAD_FILE, UPLOAD_PHOTO } from '@models/enum/queue-tokens';
import { ImageViewModelType } from '@models/file.models';
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
import { ApiTagsEnum, RoutingEnum } from '@shared/routing';
import { RmqService } from '@shared/src';

import { FilesBaseApiService } from '../application/services/file.base.service';
import { UploadFileCommand } from '../application/use-cases/upload-file.use-case';
import { ApiKeyGuard } from '../infrastructure/guards/api-key.guard';
import { FileExtractPipe } from '../infrastructure/pipes/extract-file-characters.pipe';
import { UploadProfileImageCommand } from '../application/use-cases/upload-profile-image.use-case';

import {
  FileExtractedType,
  InputFileTypesDto,
} from './models/input-models/extracted-file-types';
import { UploadPostImageDto, UploadProfileImageDto } from './models/input-models/profile-image.model';
import { UploadPostImageCommand } from '../application/use-cases/upload-post-image.use-case';

@ApiTags(ApiTagsEnum.Files)
@Controller(RoutingEnum.files)
export class FilesController {
  constructor(
    private commandBus: CommandBus,
    private filesApiService: FilesBaseApiService,
    private readonly rmqService: RmqService,
  ) {}

  @Post(ProfileNavigate.UploadProfilePhoto)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(ApiKeyGuard)
  async uploadFile(
    @Param('id') profileId: string,
    @Body() fileDto: InputFileTypesDto,
    @UploadedFile(FileExtractPipe) extractedFile: FileExtractedType,
  ): Promise<ImageViewModelType> {
    const command = new UploadFileCommand({
      ...extractedFile,
      ...fileDto,
      profileId,
    });
    return this.filesApiService.create(command);
  }

  @MessagePattern(UPLOAD_PHOTO)
  handleUploadProfileImage(
    @Payload() data?: UploadProfileImageDto,
    @Ctx() context?: RmqContext,
  ) {
    this.rmqService.ack(context);
    const command = new UploadProfileImageCommand(data);
    return this.filesApiService.create(command);
  }

  @MessagePattern('POST_CREATED')
  handleUploadPostImage(
    @Payload() data?: UploadPostImageDto,
    @Ctx() context?: RmqContext,
  ) {
    this.rmqService.ack(context);
    const command = new UploadPostImageCommand(data);
    return this.filesApiService.createPost(command);
  }

  @EventPattern('emit')
  handleUploadFile(
    @Payload() data?: UploadProfileImageDto,
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
