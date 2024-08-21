import {
  emailMatches,
  frequentLength,
  passwordLength,
  userNameLength,
} from '../../../../../../core/validation/length-constants';
import { iSValidField } from '../../../../../../core/validation/validate-input-fields';

export class CreateUserDto {
  // /**
  //  * login of the registered user account
  //  */
  // @iSValidField(loginLength, loginMatch)
  // login: string;

  /**
   * userName of the registered user account
   */
  @iSValidField(userNameLength)
  userName: string;

  /**
   * password of the registered user account.
   */
  @iSValidField(passwordLength)
  password: string;

  /**
   * email of the registered user account.
   */
  @iSValidField(frequentLength, emailMatches)
  email: string;
}
