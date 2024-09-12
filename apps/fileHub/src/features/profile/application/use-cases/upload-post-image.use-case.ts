import { FilesStorageAdapter } from '@file/core/adapters/local-files-storage.adapter';
import { OutputId } from '@models/output-id.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LayerNoticeInterceptor } from '@shared/notification';
import { Bucket } from '../../api/models/enums/file-details.enum';
import { UploadPostImageDto, UploadProfileImageDto } from '../../api/models/input-models/profile-image.model';
import { ContentType } from '../../api/models/output-models/file-output-types';
import { FilesService } from '../services/file-metadata.service';

export class UploadPostImageCommand {
  constructor(public uploadDto: UploadPostImageDto) {}
}

@CommandHandler(UploadPostImageCommand)
export class UploadPostImageUseCase
  implements ICommandHandler<UploadPostImageCommand>
{
  private location = this.constructor.name;
  constructor(
    private filesService: FilesService,
    private filesAdapter: FilesStorageAdapter,
  ) {}

  async execute(
    command: UploadPostImageCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    const { userId, fileFormat, fileType, image } = command.uploadDto;
    const { buffer, mimetype, originalname, size } = image;
    const { ContentType, Key } = this.filesService.generatePostImageKey({
      contentType: mimetype as ContentType,
      fileName: originalname,
      imageType: fileType,
      userId,
    });

    const buf = Buffer.from((buffer as any).data);

    const convertedBuffer =
      await this.filesService.convertPhotoToStorageFormat(buf);

    const bucketParams = {
      Bucket: Bucket.Inst,
      Key,
      Body: convertedBuffer,
      ContentType,
    };

    const uploadedFileInStorage =
      await this.filesAdapter.uploadFile(bucketParams);
    const { url: fileUrl, id: fileId } = uploadedFileInStorage;

    const savedFileNotice = await this.filesService.savePostFileMeta({
      userId,
      fileFormat,
      fileId,
      fileName: originalname,
      fileSize: size,
      fileType,
      fileUrl,
    });

    if (savedFileNotice.hasError)
      return savedFileNotice as LayerNoticeInterceptor;

    return new LayerNoticeInterceptor(savedFileNotice.data);
  }
}
