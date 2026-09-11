import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Username must be 3-30 characters and contain only letters, numbers, underscores, or hyphens',
  })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  username: string;
}
