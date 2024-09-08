import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Document } from 'mongoose';

import { LayerNoticeInterceptor } from '../../../../../../../libs/shared/notification';

export type UserProfileDocument = HydratedDocument<UserProfile>;

export type UserProfileModel = Model<UserProfileDocument> & UserProfileStatics;

@Schema({ timestamps: true })
export class UserProfile {
  @Prop({ type: String, required: true, unique: true })
  userName: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ required: false })
  birthDate: Date;

  @Prop({ required: false })
  country: string;

  @Prop({ required: false })
  city: string;

  @Prop({ type: String, required: false })
  about: string;

  static async makeInstance(
    createDto: Partial<UserProfile>,
  ): Promise<LayerNoticeInterceptor<UserProfileDocument>> {
    const notice = new LayerNoticeInterceptor<UserProfileDocument>();
    const userProfile = new this() as UserProfileDocument;

    userProfile.firstName = createDto.firstName;
    userProfile.lastName = createDto.lastName;
    userProfile.userName = createDto.userName;

    await notice.validateFields(userProfile);
    notice.addData(userProfile);
    return notice;
  }
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);

export const UserProfileStatics = {
  makeInstance: UserProfile.makeInstance,
};
type UserProfileStatics = typeof UserProfileStatics;

UserProfileSchema.statics = UserProfileStatics;
