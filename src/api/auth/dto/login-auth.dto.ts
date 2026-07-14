import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description:
      'User password, Min 8 chars, must include uppercase, lowercase, number and symbol',
    example: 'Stro0ngPass!',
    format: 'password',
  })
  @IsStrongPassword()
  password: string;
}
