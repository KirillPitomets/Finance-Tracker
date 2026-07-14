import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
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
    description: 'User hashed password',
    example: 'Str0ngPass!',
  })
  @IsString()
  hashPassword: string;
}
