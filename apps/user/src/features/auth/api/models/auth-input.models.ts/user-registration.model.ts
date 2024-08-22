import { ApiProperty } from '@nestjs/swagger';
import {
  emailMatches,
  frequentLength,
  passwordLength,
  userNameLength,
  stringMatch,
  passwordMatch,
} from '../../../../../../core/validation/length-constants';
import { iSValidField } from '../../../../../../core/validation/validate-input-fields';

export class CreateUserDto {
  /**
   * userName of the registered user account
   */
  @ApiProperty({
    required: true,
    example: 'John Doe',
    minLength: 6,
    maxLength: 30,
    format:
      'Username should consist of letters, numbers, underscores, or dashes',
  })
  @iSValidField(userNameLength, stringMatch)
  userName: string;

  /**
   * password of the registered user account.
   */
  @ApiProperty({
    required: true,
    minLength: 6,
    maxLength: 20,
    description:
      'Password should be between 6 and 20 characters and include numbers, letters, and special characters',
  })
  @iSValidField(passwordLength, passwordMatch)
  password: string;

  /**
   * email of the registered user account.
   */
  @ApiProperty({
    required: true,
    example: 'example@mail.com',
    description: 'Email must be a valid email address',
  })
  @iSValidField(frequentLength, emailMatches)
  email: string;
}
