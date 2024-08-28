import {
  frequentLength,
  passwordLength,
} from "../../../../../../core/validation/length-constants";
import { IsString } from "class-validator";
import { iSValidField } from "../../../../../../core/validation/validate-input-fields";

export class UserCredentialsDto {
  /**
   * email of the user account
   */
  @iSValidField(frequentLength)
  email: string;

  /**
   * password of the user account.
   */
  @iSValidField(passwordLength)
  password: string;
}

export class UserCredentialsWithCaptureTokenDto extends UserCredentialsDto {
  @IsString()
  captureToken: string;
}
