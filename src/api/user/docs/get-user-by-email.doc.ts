import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export function ApiGetUserByEmail() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find user profile by email',
      description: 'Find user profile by email',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User profile found successfully',
      type: UserEntity,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User profile not found',
    }),
    ApiQuery({
      name: 'email',
      required: true,
      format: 'email',
      example: 'john@example.com',
      description: 'User email address',
    }),
  );
}
