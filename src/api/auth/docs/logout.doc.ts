import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiLogout() {
  return applyDecorators(
    ApiOperation({
      summary: 'Logout current user',
      description: 'Clear JWT access and refresh token cookies',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Logout successfully, cookies cleared',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized - no active session',
    }),
    ApiBearerAuth(),
  );
}
