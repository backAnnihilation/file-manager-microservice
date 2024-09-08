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

export class UpdateProfileDto {
  @iSValidField(nameInitials, nameInitialsMatch)
  firstName: string;

  @iSValidField(passwordLength, nameInitialsMatch)
  lastName: string;

  @IsOptional()
  @IsDateFormat()
  dateOfBirth: Date | null;

  @IsOptional()
  @iSValidField(frequentLength)
  country: string | null;

  @IsOptional()
  @iSValidField(frequentLength)
  gender: string | null;

  @IsOptional()
  @iSValidField(frequentLength)
  city: string | null;

  @IsOptional()
  @iSValidField(aboutLength, textMatch)
  about: string | null;
}
