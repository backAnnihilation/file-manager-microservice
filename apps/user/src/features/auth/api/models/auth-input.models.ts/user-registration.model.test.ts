import { validate } from 'class-validator';
import { CreateUserDto } from './user-registration.model';

describe('CreateUserDto', () => {
  let createUserDto: CreateUserDto;

  beforeEach(() => {
    createUserDto = new CreateUserDto();
  });

  it('should validate successfully with valid data', async () => {
    createUserDto.userName = 'ValidUserName';
    createUserDto.password = 'ValidPassw0rd!';
    createUserDto.email = 'valid@example.com';

    const errors = await validate(createUserDto);

    expect(errors.length).toBe(0);
  });

  it('should fail validation if userName is invalid', async () => {
    createUserDto.userName = 'Invalid';
    createUserDto.password = 'ValidPassw0rd!';
    createUserDto.email = 'valid@example.com';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('userName'); 
  });

  it('should fail validation if password is invalid', async () => {
    createUserDto.userName = 'ValidUserName';
    createUserDto.password = 'invalid';
    createUserDto.email = 'valid@example.com';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail validation if email is invalid', async () => {
    createUserDto.userName = 'ValidUserName';
    createUserDto.password = 'ValidPassw0rd!';
    createUserDto.email = 'invalid-email';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });
});