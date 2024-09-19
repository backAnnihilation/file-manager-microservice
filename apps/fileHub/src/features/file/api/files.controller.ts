import {
  ApiTagsEnum,
  IProfileImageViewModelType,
  POST_CREATED,
  PROFILE_IMAGE,
  RmqService,
  RoutingEnum,
} from '@app/shared';
import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ProfileNavigate } from '../../../core/routes/profile-navigate';
import { FilesApiService } from '../application/services/file.base.service';
import { UploadFileCommand } from '../application/use-cases/upload-file.use-case';
import { UploadPostImageCommand } from '../application/use-cases/upload-post-image.use-case';
import { UploadProfileImageCommand } from '../application/use-cases/upload-profile-image.use-case';
import { ApiKeyGuard } from '../infrastructure/guards/api-key.guard';
import { FileExtractPipe } from '../infrastructure/pipes/extract-file-characters.pipe';
import {
  FileExtractedType,
  InputFileTypesDto,
} from './models/input-models/extracted-file-types';
import { InputPostImageDto } from './models/input-models/post-image.model';
import { InputProfileImageDto } from './models/input-models/profile-image.model';

@ApiTags(ApiTagsEnum.Files)
@Controller(RoutingEnum.files)
export class FilesController {
  constructor(
    private filesApiService: FilesApiService,
    private readonly rmqService: RmqService,
  ) {}

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
