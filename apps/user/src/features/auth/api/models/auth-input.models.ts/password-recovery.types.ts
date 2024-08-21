import { Matches } from 'class-validator';
import { emailMatches } from '../../../../../../core/validation/length-constants';

export type PasswordRecoveryType = {
  newPassword: string;
  recoveryCode: string;
};

export type SendRecoveryMsgType = { email: string; recoveryCode: string };

export class RegistrationEmailDto {
  /**
   * email of account
   */
  @Matches(emailMatches)
  email: string;
}

export type PasswordsType = {
  passwordHash: string;
  passwordSalt: string;
};

export type UpdatePasswordDto = Pick<PasswordRecoveryType, 'recoveryCode'> &
  PasswordsType;
