import {
  frequentLength,
  passwordLength,
} from '../../../../../../core/validation/length-constants';
import { IsString } from 'class-validator';
import { iSValidField } from '../../../../../../core/validation/validate-input-fields';

export class UserCredentialsDto {
  /**
   * loginOrEmail of the user account
   */
  @iSValidField(frequentLength)
  loginOrEmail: string;

  /**
   * password of the user account.
   */
  @iSValidField(passwordLength)
  password: string;
}

export class UserCredentialsWithCaptureTokenDto extends UserCredentialsDto {
  @IsString()
  recaptureToken: string;
}
