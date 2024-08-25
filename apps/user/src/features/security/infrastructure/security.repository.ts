import { Injectable } from '@nestjs/common';
import { OutputId } from '../../../../core/api/dto/output-id.dto';
import { DatabaseService } from '../../../../core/db/prisma/prisma.service';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Prisma, UserSession } from '@prisma/client';
import { UserSessionDTO } from '../../auth/api/models/dtos/user-session.dto';

@Injectable()
export class SecurityRepository {
  private userSessions: Prisma.UserSessionDelegate<DefaultArgs>;
  constructor(private prisma: DatabaseService) {
    this.userSessions = this.prisma.userSession;
  }
  async createSession(sessionDto: UserSessionDTO): Promise<void> {
    try {
      await this.userSessions.create({
        data: sessionDto,
      });
    } catch (error) {
      console.error(`
      Database fails operate with create session ${error}`);
      throw new Error(`Database fails operate with create session ${error}`);
    }
  }

  // async deleteRefreshTokensBannedUser(userId: string, manager: EntityManager) {
  //   try {
  //     await manager.delete(UserSession, { userAccount: { id: userId } });
  //   } catch (error) {
  //     throw new Error(`Database fails during delete operation ${error}`);
  //   }
  // }

  async updateIssuedToken(
    deviceId: string,
    issuedAt: Date,
    exp: Date,
  ): Promise<boolean> {
    try {
      const result = false;
      // const result = await this.userSessions.update(
      //   { device_id: deviceId },
      //   { rt_issued_at: issuedAt, rt_expiration_date: exp },
      // );

      return result;
    } catch (error) {
      console.error(
        `Database fails operate with update token's issued at ${error}`,
      );
      return false;
    }
  }

  async deleteSpecificSession(deviceId: string): Promise<boolean> {
    try {
      const result = true;
      // const sessionToDelete = await this.userSessions.findOneBy({
      //   device_id: deviceId,
      // });

      // if (!sessionToDelete) return false;

      // const result = await this.userSessions.remove(sessionToDelete);

      return !!result;
    } catch (error) {
      console.error(
        `Database fails operate with delete specific session ${error}`,
      );
      return false;
    }
  }

  async deleteOtherUserSessions(deviceId: string): Promise<boolean> {
    return true;
    // try {
    //   const otherSessions = await this.userSessions.findOneBy({
    //     device_id: Not(deviceId),
    //   });

    //   if (!otherSessions) return false;

    //   const result = await this.userSessions.remove(otherSessions);

    //   return !!result;
    // } catch (error) {
    //   console.error(
    //     `Database fails operate with delete other sessions ${error}`,
    //   );
    //   return false;
    // }
  }
}
