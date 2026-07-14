import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiDelete() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete current user account',
      description:
        'Permanently deletes the authenticated user account and all associated data.  Clears auth cookies.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Account deleted successfully',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiBearerAuth(),
  );
}
