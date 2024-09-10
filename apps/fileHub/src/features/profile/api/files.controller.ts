import { ProfileNavigate } from '@file/core/routes/profile-navigate';
import { UPLOAD_PHOTO } from '@models/enum/queue-tokens';
import { ImageViewModelType } from '@models/file.models';
import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ApiTagsEnum, RoutingEnum } from '@shared/routing';
import { FilesBaseApiService } from '../application/services/file.base.service';
import { UploadFileCommand } from '../application/use-cases/upload-file.use-case';
import { ApiKeyGuard } from '../infrastructure/guards/api-key.guard';
import { FileExtractPipe } from '../infrastructure/pipes/extract-file-characters.pipe';
import {
  FileExtractedType,
  InputFileTypesDto,
} from './models/input-models/extracted-file-types';

@ApiTags(ApiTagsEnum.Files)
@Controller(RoutingEnum.files)
export class FilesController {
  constructor(
    private commandBus: CommandBus,
    private filesApiService: FilesBaseApiService,
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
  handleUploadPhoto(@Payload() data?: number[], @Ctx() context?: RmqContext) {
    console.log(data);

    const originalChanel = context.getChannelRef();
    const originalMsg = context.getMessage();
    originalChanel.ack(originalMsg);
    return true;
    // const command = new UploadProfileImageCommand({
    //   ...extractedFile,
    //   ...fileDto,
    //   profileId,
    // });
    // return this.filesApiService.create(command);
  }
}
