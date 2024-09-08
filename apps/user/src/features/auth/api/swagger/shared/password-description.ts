import { ApiProperty } from '@nestjs/swagger';
import { passwordMatch } from '@shared/validation/input-constants';

export const PasswordDescription = () =>
  ApiProperty({
    required: true,
    minLength: 6,
    maxLength: 20,
    format:
      'Password should be between 6 and 20 characters and include numbers, letters, and special characters',
    pattern: passwordMatch.toString(),
  });
