import { IsOptional } from 'class-validator';
import {
  aboutLength,
  frequentLength,
  nameInitials,
  nameInitialsMatch,
  passwordLength,
  textMatch,
} from '../../../../../../../../libs/shared/validation/input-constants';
import { iSValidField } from '../../../../../../../../libs/shared/validation/validate-input-fields';
import { IsDateFormat } from '../../../infrastructure/validation/date-format-validate';

export class UpdateProfileInputModel {
  @iSValidField(nameInitials, nameInitialsMatch)
  firstName: string;

  @iSValidField(passwordLength, nameInitialsMatch)
  lastName: string;

  @IsOptional()
  @IsDateFormat()
  dateOfBirth: string;

  @IsOptional()
  @iSValidField(frequentLength)
  country?: string;

  @IsOptional()
  @iSValidField(frequentLength)
  gender?: string;

  @IsOptional()
  @iSValidField(frequentLength)
  city?: string;

  @IsOptional()
  @iSValidField(aboutLength, textMatch)
  about?: string;
}

export interface IUpdateProfileCommand extends UpdateProfileInputModel {
  userId: string;
}
