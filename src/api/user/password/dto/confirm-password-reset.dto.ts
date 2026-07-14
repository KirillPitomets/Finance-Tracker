import { IsString, IsStrongPassword } from 'class-validator';
import { Match } from 'src/common/decorators/class-validator/match.decorator';
import { ConfirmTokenDto } from 'src/core/security/confirm-token/dto/confirm-token.dto';

export class ConfirmPasswordResetDto extends ConfirmTokenDto {
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsStrongPassword()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
