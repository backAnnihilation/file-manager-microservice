import { frequentLength } from '../../../../../../core/validation/validate-input-constants';
import { iSValidField } from '../../../../../../core/validation/validate-input-fields';

export class RegistrationCodeDto {
  @iSValidField(frequentLength)
  code: string;
}
