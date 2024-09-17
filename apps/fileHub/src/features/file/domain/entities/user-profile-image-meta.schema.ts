import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import {
  BaseImageMeta,
  BaseImageMetaDto,
  BaseImageMetaSchema,
  ImageMetaStatics,
} from './base-image-meta.schema';

export type UserProfileDocument = HydratedDocument<ProfileImageMeta>;
export type UserProfileModel = Model<UserProfileDocument> & ImageMetaStatics;
export type ProfileImageMetaDto = BaseImageMetaDto & {
  profileId: string;
};

@Schema({ timestamps: true })
export class ProfileImageMeta extends BaseImageMeta {
  @Prop({ required: true })
  profileId: string;
}

export const ProfileImageMetaSchema =
  SchemaFactory.createForClass(ProfileImageMeta);
ProfileImageMetaSchema.statics.makeInstance =
  BaseImageMetaSchema.statics.makeInstance;
