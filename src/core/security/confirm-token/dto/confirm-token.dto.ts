import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { CONFIRM_TOKEN_BYTES } from 'src/core/security/confirm-token/constants';
const CONFIRM_TOKEN_HEX_LENGTH = CONFIRM_TOKEN_BYTES * 2;

export class ConfirmTokenDto {
  @ApiProperty({
    description: 'Token for confirm requests',
    example: 'b509ce4ce709a...',
  })
  @IsString()
  @Length(CONFIRM_TOKEN_HEX_LENGTH, CONFIRM_TOKEN_HEX_LENGTH)
  token: string;
}
