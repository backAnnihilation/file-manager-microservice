import { Injectable } from '@nestjs/common';
import { UserRecoveryType } from '../api/models/auth.output.models/auth.output.models';
import {
  EmailDtoType,
} from '../api/models/auth.output.models/auth.user.types';
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
  private tempUserAccounts: any;
  private userAccounts: Prisma.UserAccountDelegate<DefaultArgs>;
  private userBans: any;
  constructor(private readonly prisma: DatabaseService) {
    this.userAccounts = this.prisma.userAccount;
  }

  async createTemporaryUserAccount(
    createDto: CreateTempAccountDto,
  ): Promise<OutputId | null> {
    try {
      const { recoveryCode, expirationDate, email } = createDto;

      const result = await this.tempUserAccounts.insert({
        email: email,
        recovery_code: recoveryCode,
        code_expiration_time: expirationDate,
      });

      return result.raw[0].id;
    } catch (error) {
      console.error(
        `While creating the temp user account occurred some errors: ${error}`,
      );
      return null;
    }
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

  async findTemporaryAccountByRecoveryCode(
    recoveryCode: string,
  ): Promise<any | null> {
    try {
      const result = await this.tempUserAccounts.findOneBy({
        recovery_code: recoveryCode,
      });

      if (!result) return null;

      return result;
    } catch (error) {
      console.error(
        `While find the temporary account occurred some errors: ${error}`,
      );
      return null;
    }
  }

  async deleteTemporaryUserAccount(recoveryCode: string): Promise<boolean> {
    try {
      const result = await this.tempUserAccounts.delete({
        recovery_code: recoveryCode,
      });

      return result.affected !== 0;
    } catch (error) {
      console.error('Database fails operate with deleting user', error);
      return false;
    }
  }

  async findUserAccountByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserAccount | null> {
    try {
      const currentTime = new Date();

      const result = await this.userAccounts.findFirst({});

      if (!result) return null;

      return result;
    } catch (e) {
      console.error(
        `there were some problems during find user's account by confirmation code, ${e}`,
      );
      return null;
    }
  }

  async findUserByEmail(inputData: EmailDtoType): Promise<UserAccount | null> {
    try {
      const { email } = inputData;

      const result = await this.userAccounts.findFirst({ where: { email } });

      if (!result) return null;

      return result;
    } catch (e) {
      console.error(`there were some problems during find user by email, ${e}`);
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
        `there were some problems during update user's confirmation code: ${error}`,
      );
      return false;
    }
  }

  // todo add user id
  async updateConfirmationCode(
    email: string,
    confirmationCode: string,
    newConfirmationExpDate: Date,
  ): Promise<boolean> {
    try {
      // const result = await this.userAccounts.update({
      //   where: { email },
      //   data: { confirmationCode, confirmationExpDate: newConfirmationExpDate },
      // });

      // return !!result;
      return true;
    } catch (error) {
      console.error(
        `Database fails operate during update confirmation code operation ${error}`,
      );
      return false;
    }
  }

  async updateRecoveryCode(
    email: string,
    recoveryData: UserRecoveryType,
  ): Promise<boolean> {
    try {
      // const result = await this.userAccounts.update(
      //   { email: email },
      //   {
      //     password_recovery_code: recoveryData.recoveryCode,
      //     password_recovery_expiration_date: recoveryData.expirationDate,
      //   },
      // );

      return true;
    } catch (error) {
      console.error(
        `Database fails operate during update recovery code operation ${error}`,
      );
      return false;
    }
  }

  async updateUserPassword(updateData: UpdatePasswordDto): Promise<boolean> {
    try {
      const { passwordHash, passwordSalt, recoveryCode } = updateData;

      // const result = await this.userAccounts.update(
      //   { password_recovery_code: recoveryCode },
      //   {
      //     password_recovery_code: '',
      //     password_recovery_expiration_date: '',
      //     password_hash: passwordHash,
      //     password_salt: passwordSalt,
      //   },
      // );

      return true;
    } catch (error) {
      console.error(
        `Database fails operate with update user password ${error}`,
      );
      return false;
    }
  }
}
