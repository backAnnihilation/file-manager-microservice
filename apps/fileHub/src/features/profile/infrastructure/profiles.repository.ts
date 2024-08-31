import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserProfile,
  UserProfileDocument,
  UserProfileModel,
} from '../../../core/db/domain/user-profile.schema';

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectModel(UserProfile.name) private profileModel: UserProfileModel,
  ) {}

  async save(profileDto: UserProfileDocument): Promise<UserProfileDocument> {
    try {
      return await profileDto.save();
    } catch (error) {
      console.log(`failed save profile`);
      throw new Error(error);
    }
  }

  async getById(profileId: string): Promise<any> {
    try {
      const result = await this.profileModel.findById(profileId).lean();

      if (!result) return null;

      return result;
    } catch (error) {
      console.error(`Database fails operate during the find blog`, error);
      return null;
    }
  }

  // async updateBlog(
  //   blogId: string,
  //   updateData: UpdateBlogModel,
  // ): Promise<boolean> {
  //   try {
  //     const result = await this.BlogModel.updateOne(
  //       { _id: new ObjectId(blogId) },
  //       {
  //         $set: {
  //           name: updateData.name,
  //           description: updateData.description,
  //           websiteUrl: updateData.websiteUrl,
  //         },
  //       },
  //     );
  //     return result.matchedCount === 1;
  //   } catch (e) {
  //     console.error(`Database fails operate during the upgrade blog`, e);
  //     return false;
  //   }
  // }

  // async deleteBlog(blogId: string): Promise<BlogDBType> {
  //   try {
  //     return this.BlogModel.findByIdAndDelete(new ObjectId(blogId)).lean();
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Database fails operate during removal operation',
  //     );
  //   }
  // }
}
