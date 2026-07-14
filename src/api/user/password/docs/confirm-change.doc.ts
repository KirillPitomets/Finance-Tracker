import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfirmPasswordChangeDto } from '../dto';

export function ApiConfirmChangeRequest() {
  return applyDecorators(
    ApiOperation({
      summary: 'Confirm an password change request',
      description:
        'Confirms an password change request using the confirmation token',
    }),
    ApiBody({ type: ConfirmPasswordChangeDto }),
    ApiResponse({
      status: HttpStatus.SEE_OTHER,
      description:
        'Redirects to the success page if the password is changed successfully and logs the user out of all active sessions. Otherwise, redirects to the failure page.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid or missing confirmation token',
    }),
  );
}
