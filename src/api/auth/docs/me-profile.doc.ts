import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from 'src/api/user/entities/user.entity';

export function ApiMeProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get current authenticated user profile',
      description:
        'Returns profile of the currently authenticated user based on JWT token in cookie',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User profile returned successfully ',
      type: UserEntity,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized - token missing or expired',
    }),
    ApiBearerAuth(),
  );
}
