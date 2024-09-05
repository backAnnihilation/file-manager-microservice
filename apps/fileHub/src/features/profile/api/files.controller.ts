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
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ProfileNavigate } from '@file/core/routes/profile-navigate';
import { UploadFileCommand } from '../application/use-cases/upload-file.use-case';
import { ApiKeyGuard } from '../infrastructure/guards/api-key.guard';
import { FileExtractPipe } from '../infrastructure/pipes/extract-file-characters.pipe';
import {
  FileExtractedType,
  InputFileTypesDto,
} from './models/input-models/extracted-file-types';
import { FilesBaseApiService } from '../application/services/file.base.service';
import { ApiTagsEnum, RoutingEnum } from '@shared/routing';
import { ImageViewModelType } from '@models/file.models';

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
}
