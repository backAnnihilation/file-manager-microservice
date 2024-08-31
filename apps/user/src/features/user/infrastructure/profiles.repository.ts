import { Injectable } from '@nestjs/common';
import { Prisma, UserProfile } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { DatabaseService } from '../../../../core/db/prisma/prisma.service';

@Injectable()
export class ProfilesRepository {
  private userProfiles: Prisma.UserProfileDelegate<DefaultArgs>;
  constructor(private readonly prisma: DatabaseService) {
    this.userProfiles = this.prisma.userProfile;
  }

  async save(data: Prisma.UserProfileCreateInput): Promise<UserProfile> {
    try {
      return await this.userProfiles.create({ data });
    } catch (error) {
      console.log(`failed save profile ${error}`);
      throw new Error(error);
    }
  }

  async getById(id: string): Promise<any> {
    try {
      const result = await this.userProfiles.findUnique({ where: { id } });

      if (!result) return null;

      return result;
    } catch (error) {
      console.error(`getById ${error}`);
      return null;
    }
  }
}
