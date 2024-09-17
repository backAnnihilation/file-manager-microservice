import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

import { LayerNoticeInterceptor } from '../../../../../../../libs/shared/notification';
import {
  FileFormat,
  ImageType,
} from '../../api/models/enums/file-details.enum';

export type PostFileMetaDocument = HydratedDocument<PostFileMeta>;
export type PostFileMetaModel = Model<PostFileMetaDocument> &
  PostFileMetaStatics;

export type CreatePostFileMetaDto = {
  fileName: string;
  fileUrl: string;
  fileId: string;
  fileSize: number;
  userId: string;
  fileFormat: FileFormat;
  fileType: ImageType;
};

const PostFileDetails = {
  fileFormat: { type: String, enum: FileFormat, required: true },
  fileType: { type: String, enum: ImageType, required: true },
  resolution: { type: String, required: false },
  duration: { type: String, required: false },
};
type PostFileDetailsType = {
  fileFormat: FileFormat;
  fileType: ImageType;
};

@Schema({ timestamps: true })
export class PostFileMeta {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ _id: false, type: PostFileDetails })
  fileDetails: PostFileDetailsType;

  @Prop({ type: String, required: true })
  fileId: string;

  @Prop({ required: true })
  fileSize: number;

  createdAt: Date;
  updatedAt: Date;

  static async makeInstance(
    uploadFileDto: CreatePostFileMetaDto,
  ): Promise<LayerNoticeInterceptor<PostFileMetaDocument>> {
    const notice = new LayerNoticeInterceptor<PostFileMetaDocument>();
    const { fileFormat, fileType, ...mainFileDetails } = uploadFileDto;
    const fileMeta = new this() as PostFileMetaDocument;
    Object.assign(fileMeta, mainFileDetails);
    fileMeta.fileDetails = { fileFormat, fileType };

    await notice.validateFields(fileMeta);
    notice.addData(fileMeta);
    return notice;
  }
}
export const PostFileMetaSchema = SchemaFactory.createForClass(PostFileMeta);
export const PostFileMetaStatics = {
  makeInstance: PostFileMeta.makeInstance,
};
type PostFileMetaStatics = typeof PostFileMetaStatics;
PostFileMetaSchema.statics = PostFileMetaStatics;
