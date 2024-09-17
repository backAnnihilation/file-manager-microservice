import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import {
  BaseImageMeta,
  BaseImageMetaDto,
  BaseImageMetaSchema,
  ImageMetaStatics,
} from './base-image-meta.schema';

export type PostImageMetaDocument = HydratedDocument<PostImageMeta>;
export type PostImageMetaModel = Model<PostImageMetaDocument> &
  ImageMetaStatics;
export type PostImageMetaDto = BaseImageMetaDto & {
  userId: string;
  postId: string;
};

@Schema({ timestamps: true })
export class PostImageMeta extends BaseImageMeta {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  postId: string;
}

export const PostImageMetaSchema = SchemaFactory.createForClass(PostImageMeta);

PostImageMetaSchema.statics.makeInstance =
  BaseImageMetaSchema.statics.makeInstance;
