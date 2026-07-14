import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class RequestChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'Str0ngPass!',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description:
      'A new user password, Min 8 chars, must include uppercase, lowercase, number and symbol',
    example: 'Str0ngPass_2233',
    format: 'password',
    minLength: 8,
  })
  @IsStrongPassword()
  newPassword: string;

  @ApiProperty({
    description:
      'Repeat the new password to confirm it, Must be identical to newPassword  ',
    example: 'Str0ngPass_2233',
    format: 'password',
    minLength: 8,
  })
  @IsString()
  @IsStrongPassword()
  confirmNewPassword: string;
}
