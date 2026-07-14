import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfirmEmailChangeDto } from '../dto';

export function ApiConfirmChange() {
  return applyDecorators(
    ApiOperation({
      summary: 'Confirm an email change request',
      description:
        'Confirms an email change request using the confirmation token',
    }),
    ApiBody({ type: ConfirmEmailChangeDto }),
    ApiResponse({
      status: HttpStatus.SEE_OTHER,
      description:
        'Redirects tp the success page if the confirmation succeeds, otherwise redirects to failure page',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'User with that email already registered',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid or missing confirmation token',
    }),
  );
}
