import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';
import { Match } from 'src/common/decorators/class-validator/match.decorator';

export class RegisterAuthDto {
  @ApiProperty({
    description: 'Display name of user',
    example: 'John',
    minLength: 2,
    maxLength: 16,
  })
  @IsString()
  @Length(2, 16)
  name: string;
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description:
      'User password, Min 8 chars, must include uppercase, lowercase, number and symbol',
    example: 'Str0ngPass!',
    format: 'password',
    minLength: 8,
  })
  @IsStrongPassword()
  password: string;
  @ApiProperty({
    description: 'Must match the password field exactly',
    example: 'Str0ngPass!',
    format: 'password',
  })
  @Match('password', { message: 'Password do not match' })
  confirmPassword: string;
}
