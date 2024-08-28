import {
  passwordLength,
  frequentLength,
} from "../../../../../../core/validation/length-constants";
import { iSValidField } from "../../../../../../core/validation/validate-input-fields";

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
