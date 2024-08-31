import { frequentLength } from '../../../../../../../../libs/shared/validation/input-constants';
import { iSValidField } from '../../../../../../../../libs/shared/validation/validate-input-fields';

export class RegistrationCodeDto {
  @iSValidField(frequentLength)
  code: string;
}
