import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthEntity } from '../entities/auth.entity';

export function ApiRefresh() {
  return applyDecorators(
    ApiOperation({
      summary: 'Refresh access token',
      description:
        'Issue new access token using refresh token from cookie. Rotates refresh token',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Tokens refreshed successfully',
      type: AuthEntity,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Refresh token missing, invalid or expired',
    }),
    ApiBearerAuth(),
  );
}
