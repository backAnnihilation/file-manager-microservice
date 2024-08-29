import { Injectable } from '@nestjs/common';
import {
  UpdateConfirmationCodeDto,
  UserRecoveryType,
} from '../api/models/auth.output.models/auth.output.models';
import { EmailDtoType } from '../api/models/auth.output.models/auth.user.types';
import { CreateTempAccountDto } from '../api/models/temp-account.models.ts/temp-account-models';
import { UpdatePasswordDto } from '../api/models/auth-input.models.ts/password-recovery.types';
import { OutputId } from '../../../../core/api/dto/output-id.dto';
import { Prisma, UserAccount } from '@prisma/client';
import { DatabaseService } from '../../../../core/db/prisma/prisma.service';
import { DefaultArgs } from '@prisma/client/runtime/library';

type BanInfoType = {
  isBanned: boolean;
};

@Injectable()
export class AuthRepository {
  private userAccounts: Prisma.UserAccountDelegate<DefaultArgs>;
  private userBans: any;
  constructor(private readonly prisma: DatabaseService) {
    this.userAccounts = this.prisma.userAccount;
  }

  async getUserBanInfo(userId: string): Promise<BanInfoType> {
    try {
      const result = await this.userBans.findOne({
        where: { user: { id: userId } },
      });

      if (!result) return null;

      return { isBanned: result.isBanned };
    } catch (error) {}
  }

  async findUserAccountByConfirmationCode(
    confirmationCode: string
  ): Promise<UserAccount | null> {
    try {
      const result = await this.userAccounts.findFirst({
        where: { confirmationCode },
      });

      if (!result) return null;

      return result;
    } catch (e) {
      console.error(
        `there were some problems during find user's account by confirmation code, ${e}`
      );
      return null;
    }
  }
  async findConfirmedUserByEmailOrName({
    userName,
    email,
  }): Promise<UserAccount | null> {
    try {
      return await this.userAccounts.findFirst({
        where: { OR: [{ email }, { userName }], AND: { isConfirmed: true } },
      });
    } catch (error) {
      console.log(`findByEmailOrName: ${error}`);
      return null;
    }
  }

  async findExistedUserByEmailOrNameForRegistration({
                                                      userName,
                                                      email,
                                                    }: {
    userName: string;
    email: string;
  }): Promise<UserAccount | null> {
    try {
      // Проверяем наличие пользователя с тем же email, исключая записи с префиксами в userName
      const userByEmail = await this.userAccounts.findFirst({
        where: {
          email,
          AND: [
            {
              userName: {
                not: {
                  startsWith: 'google_',
                },
              },
            },
            {
              userName: {
                not: {
                  startsWith: 'github_',
                },
              },
            },
          ],
        },
      });

      // Проверяем наличие пользователя с тем же userName без учета префиксов
      const userByUserName = await this.userAccounts.findFirst({
        where: {
          userName,
        },
      });

      // Возвращаем пользователя, если найдено совпадение по email или userName
      if (userByEmail || userByUserName) {
        return userByEmail || userByUserName;
      }

      // Если совпадений нет, возвращаем null, что позволяет продолжить регистрацию
      return null;
    } catch (error) {
      console.log(`findExistedUserByEmailOrNameForRegistration: ${error}`);
      return null;
    }
  }







  async findExistedUserByEmailOrName({
    userName,
    email,
  }): Promise<UserAccount | null> {
    try {
      return await this.userAccounts.findFirst({
        where: { OR: [{ email }, { userName }] },
      });
    } catch (error) {
      console.log(`findByEmailOrName: ${error}`);
      return null;
    }
  }

  async findExistedUserByEmailAndName({
                                       userName,
                                       email,
                                     }): Promise<UserAccount | null> {
    try {
      return await this.userAccounts.findFirst({
        where: {email, userName},
      });
    } catch (error) {
      console.log(`findByEmailOrName: ${error}`);
      return null;
    }
  }

  async findUserByEmail(email: string): Promise<UserAccount | null> {
    try {
      const result = await this.userAccounts.findFirst({
        where: {
          email,
          AND: [
            {
              userName: {
                not: {
                  startsWith: 'google_',
                },
              },
            },
            {
              userName: {
                not: {
                  startsWith: 'github_',
                },
              },
            },
          ],
        },
      });

      if(!result) return null

      return result;
    } catch (e) {
      console.error(`Произошла ошибка при поиске пользователя по email: ${e}`);
      return null;
    }
  }
  async findUserByRecoveryCode(code: string): Promise<UserAccount | null> {
    try {
      return await this.userAccounts.findFirst({
        where: {
          AND: [
            { passwordRecoveryCode: code },
            { passwordRecoveryExpDate: { gte: new Date() } },
          ],
        },
      });
    } catch (e) {
      console.error(
        `there were some problems during find user by recovery code, ${e}`
      );
      return null;
    }
  }

  async updateConfirmation(id: string): Promise<boolean> {
    try {
      const result = await this.userAccounts.update({
        where: { id },
        data: { isConfirmed: true },
      });

      return !!result;
    } catch (error) {
      console.error(
        `there were some problems during update user's confirmation code: ${error}`
      );
      return false;
    }
  }

  async updateConfirmationCode(
    confirmationData: UpdateConfirmationCodeDto
  ): Promise<boolean> {
    try {
      const { id, expirationDate, recoveryCode } = confirmationData;

      const result = await this.userAccounts.update({
        where: { id },
        data: {
          confirmationCode: recoveryCode,
          confirmationExpDate: expirationDate,
        },
      });

      return !!result;
    } catch (error) {
      console.error(
        `Database fails operate during update confirmation code operation ${error}`
      );
      return false;
    }
  }

  async updateRecoveryCode(
    email: string,
    recoveryData: UserRecoveryType
  ): Promise<void> {
    try {
      // Сначала находим пользователя с нужными условиями
      const user = await this.userAccounts.findFirst({
        where: {
          email,
          isConfirmed: false,
          AND: [
            {
              userName: {
                not: {
                  startsWith: 'google_',
                },
              },
            },
            {
              userName: {
                not: {
                  startsWith: 'github_',
                },
              },
            },
          ],
        },
      });

      // Если пользователь найден, обновляем его данные
      if (user) {
        await this.userAccounts.update({
          where: { id: user.id }, // Обновляем пользователя по его уникальному ID
          data: {
            passwordRecoveryCode: recoveryData.recoveryCode,
            passwordRecoveryExpDate: recoveryData.expirationDate,
          },
        });
      } else {
        console.error(`Пользователь с email ${email} не найден или имеет запрещенный userName.`);
      }
    } catch (error) {
      console.error(
        `Ошибка базы данных при обновлении кода восстановления: ${error}`
      );
      throw new Error(error);
    }
  }


  async updateUserPassword(updateData: UpdatePasswordDto): Promise<void> {
    try {
      const { passwordHash, userId } = updateData;

      await this.userAccounts.update({
        where: { id: userId },
        data: {
          passwordHash,
          passwordRecoveryCode: null,
          passwordRecoveryExpDate: null,
        },
      });
    } catch (error) {
      console.error(
        `Database fails operate with update user password ${error}`
      );
      throw new Error(error);
    }
  }
}
