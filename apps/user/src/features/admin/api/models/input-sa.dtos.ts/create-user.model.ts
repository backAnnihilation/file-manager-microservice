import {
  loginLength,
  passwordLength,
  frequentLength,
  emailMatches,
  stringMatch,
} from '../../../../../../core/validation/length-constants';
import { iSValidField } from '../../../../../../core/validation/validate-input-fields';

export class CreateUserDto {
  /**
   * user's login
   */
  @iSValidField(loginLength, stringMatch)
  userName: string;

  /**
   * user's registration password
   */
  @iSValidField(passwordLength)
  password: string;

  /**
   * user's registration email
   */
  @iSValidField(frequentLength, emailMatches)
  email: string;
}
