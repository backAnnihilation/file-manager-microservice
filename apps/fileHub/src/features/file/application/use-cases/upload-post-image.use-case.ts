import { FilesStorageAdapter } from '@file/core/adapters/local-files-storage.adapter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LayerNoticeInterceptor, MediaType, OutputIdAndUrl } from '@app/shared';
import { Bucket } from '../../api/models/enums/file-models.enum';
import { UploadPostImageDto } from '../../api/models/input-models/profile-image.model';
import { ContentType } from '../../api/models/output-models/file-output-types';
import { FilesService } from '../services/file-metadata.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostImageMeta,
  PostImageMetaModel,
} from '../../domain/entities/post-image-meta.schema';

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
    @InjectModel(PostImageMeta.name) private PostModel: PostImageMetaModel,
  ) {}

  async execute(command: UploadPostImageCommand) {
    // : Promise<LayerNoticeInterceptor<OutputIdAndUrl>>
    const { userId, fileType, image } = command.uploadDto;
    const { buffer, mimetype, originalname, size } = image;
    const { ContentType, Key } = this.filesService.generatePostImageKey({
      contentType: mimetype as ContentType,
      fileName: originalname,
      imageType: fileType,
      userId,
    });

    const postDto = PostImageMeta.makeInstance({
      userId,
      fileId: '1',
      fileFormat: MediaType.IMAGE,
      fileName: originalname,
      fileSize: size,
      fileType,
      fileUrl: Key,
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

    // const savedFileNotice = await this.filesService.savePostFileMeta({
    //   userId,
    //   fileFormat,
    //   fileId,
    //   fileName: originalname,
    //   fileSize: size,
    //   fileType,
    //   fileUrl,
    // });

    // if (savedFileNotice.hasError)
    //   return savedFileNotice as LayerNoticeInterceptor;

    // return new LayerNoticeInterceptor(savedFileNotice.data);
  }
}
