import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PasswordResetRequestDto } from '../dto';

export function ApiPasswordResetRequest() {
  return applyDecorators(
    ApiOperation({
      summary: 'Request to reset password',
      description:
        'Make request to reset password, and send confirmation email',
    }),
    ApiBody({ type: PasswordResetRequestDto }),
    ApiResponse({
      status: HttpStatus.ACCEPTED,
      description: 'Confirmation email has been sent',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User with that email not found',
    }),
  );
}
