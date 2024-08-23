import { InputEmailDto } from '../../../api/models/auth-input.models.ts/password-recovery.types';

export class CreateTemporaryAccountCommand {
  constructor(public createDto: InputEmailDto) {}
}
