import { Injectable } from '@nestjs/common';
import {
  GetErrors,
  LayerNoticeInterceptor,
} from '../../../../core/utils/notification';
import { UserAccount } from '@prisma/client';

@Injectable()
export class UserService {
  private location = this.constructor.name;
  constructor() {}

  validateUserAccount = (
    validateDto: ValidationFieldsType = {
      userAccount: null,
      isConfirmed: true,
      isExist: true,
      isExpired: true,
    },
  ) => {
    const { userAccount, isConfirmed, isExist, isExpired } = validateDto;
    const notice = new LayerNoticeInterceptor();

    if (isExist) {
      if (!userAccount) {
        notice.addError(
          'user account was not found',
          this.location,
          GetErrors.NotFound,
        );
        return notice;
      }
    }
    if (isConfirmed) {
      if (userAccount.isConfirmed) {
        notice.addError(
          'user account already confirmed',
          this.location,
          GetErrors.Forbidden,
        );
        return notice;
      }
    }
    if (isExpired) {
      const isValid = this.checkConfirmationRelevant(
        userAccount.confirmationExpDate,
      );
      if (!isValid) {
        notice.addError(
          'confirmation code expired',
          this.location,
          GetErrors.Forbidden,
        );
        return notice;
      }
    }
    return notice;
  };

  private checkConfirmationRelevant = (confirmationExpDate: Date) => {
    const now = new Date().getTime();
    return now < confirmationExpDate.getTime();
  };
}

type ValidationFieldsType = {
  userAccount: UserAccount | null;
  isConfirmed?: boolean;
  isExist?: boolean;
  isExpired?: boolean;
};
