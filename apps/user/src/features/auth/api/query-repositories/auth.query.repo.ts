import { Injectable } from '@nestjs/common';
import { RegistrationEmailDto } from '../models/auth-input.models.ts/password-recovery.types';
import { LoginOrEmailType } from '../models/auth.output.models/auth.user.types';

@Injectable()
export class AuthQueryRepository {
  constructor() {}

  async findUserAccountByRecoveryCode(code: string) {
    return 'viewUserAccount';
  }

  async findByLoginOrEmail(inputDto: LoginOrEmailType) {
    return 'viewUserAccount';
  }

  async getUserById(userId: string) {
    return { accountData: { email: '', login: '', id: '' } };
  }
}
