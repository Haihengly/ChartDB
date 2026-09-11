import { IsEmail, IsString, MinLength, Matches, Validate } from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'validUsername', async: false })
export class ValidUsernameConstraint implements ValidatorConstraintInterface {
  validate(username: string): boolean {
    // Must match character set: letters, numbers, underscore, hyphen, period
    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      return false;
    }

    // Cannot start or end with period
    if (username.startsWith('.') || username.endsWith('.')) {
      return false;
    }

    // Cannot have consecutive periods
    if (username.includes('..')) {
      return false;
    }

    return true;
  }

  defaultMessage(): string {
    return 'Username must be 3-30 characters and contain only letters, numbers, underscores, hyphens, or periods. Periods cannot be at the start/end or consecutive.';
  }
}

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @Validate(ValidUsernameConstraint)
  username: string;
}
