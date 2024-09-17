import {
  iSValidField,
  userNameLength,
  stringMatch,
  passwordLength,
  passwordMatch,
  frequentLength,
  emailMatches,
} from '@app/shared';

export class CreateUserDto {
  /**
   * userName of the registered user account
   */
  @iSValidField(userNameLength, stringMatch)
  userName: string;

  /**
   * password of the registered user account.
   */
  @iSValidField(passwordLength, passwordMatch)
  password: string;

  /**
   * email of the registered user account.
   */
  @iSValidField(frequentLength, emailMatches)
  email: string;
}
