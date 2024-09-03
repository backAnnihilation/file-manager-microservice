import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { FileType } from '../../../../../../libs/shared/models/file.models';
import {
  ApiTagsEnum,
  RoutingEnum,
} from '../../../../../../libs/shared/routing';
import { ProfileNavigate } from '../../../core/routes/profile-navigate';
import { UploadFileCommand } from '../application/use-cases/upload-file.use-case';
import { ApiKeyGuard } from '../infrastructure/guards/api-key.guard';

@ApiTags(ApiTagsEnum.Files)
@Controller(RoutingEnum.files)
export class FilesController {
  constructor(
    private commandBus: CommandBus,
  ) {}

  @Post(ProfileNavigate.UploadProfilePhoto)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(ApiKeyGuard)
  async uploadFile(
    @Param('id') userId: string,
    @UploadedFile() file: FileType,
  ): Promise<{ url: string }> {
    const command = new UploadFileCommand({ ...file, userId });
    return await this.commandBus.execute(command);
  }
}
