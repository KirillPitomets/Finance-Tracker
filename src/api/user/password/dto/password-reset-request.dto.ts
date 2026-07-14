import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class PasswordResetRequestDto {
  @ApiProperty({
    description: 'User email for sent reset token',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;
}
