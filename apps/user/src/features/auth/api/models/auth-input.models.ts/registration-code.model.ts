import { frequentLength } from '../../../../../../../../libs/shared/src/validation/input-constants';
import { iSValidField } from '../../../../../../../../libs/shared/src/validation/validate-input-fields';

export class RegistrationCodeDto {
  @iSValidField(frequentLength)
  code: string;
}
