import {
  passwordLength,
  frequentLength,
} from '../../../../../../../../libs/shared/src/validation/input-constants';
import { iSValidField } from '../../../../../../../../libs/shared/src/validation/validate-input-fields';

export class RecoveryPassDto {
  /**
   * newPassword of the user account
   */
  @iSValidField(passwordLength)
  newPassword: string;

  /**
   * recoveryCode of the user account.
   */
  @iSValidField(frequentLength)
  recoveryCode: string;
}
