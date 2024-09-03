import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { LayerNoticeInterceptor } from '../../../../../../../libs/shared/notification';
import {
  FileFormat,
  ImageType,
} from '../../api/models/enums/file-details.enum';

export type FileMetaDocument = HydratedDocument<FileMeta>;

export type FileMetaModel = Model<FileMetaDocument> & FileMetaStatics;

const FileDetails = {
  type: { type: String, enum: FileFormat, required: true },
  imageType: { type: String, enum: ImageType, required: false },
  resolution: { type: String, required: false },
  duration: { type: String, required: false },
};
type FileDetailsType = keyof typeof FileDetails;

@Schema({ timestamps: true })
export class FileMeta {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ _id: false, type: FileDetails })
  fileDetails: FileDetailsType;

  @Prop({ type: String, required: true })
  fileId: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  userId: string;

  static async makeInstance(
    uploadFileDto: Partial<FileMeta>,
  ): Promise<LayerNoticeInterceptor<FileMetaDocument>> {
    const notice = new LayerNoticeInterceptor<FileMetaDocument>();
    const fileMeta = new this() as FileMetaDocument;
    Object.assign(fileMeta, uploadFileDto);

    await notice.validateFields(fileMeta);
    notice.addData(fileMeta);
    return notice;
  }
}
export const FileMetaSchema = SchemaFactory.createForClass(FileMeta);
export const FileMetaStatics = {
  makeInstance: FileMeta.makeInstance,
};
type FileMetaStatics = typeof FileMetaStatics;
FileMetaSchema.statics = FileMetaStatics;
