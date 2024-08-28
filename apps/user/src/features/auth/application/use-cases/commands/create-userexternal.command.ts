import { CreateUserDto } from '../../../api/models/auth-input.models.ts/user-registration.model';

export class CreateUserExternalCommand {
  constructor(public createDto: CreateUserDto) {}
}
