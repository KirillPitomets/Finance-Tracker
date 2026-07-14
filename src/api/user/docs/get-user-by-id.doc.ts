import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export function ApiGetUserById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find user profile by id',
      description: 'Find user profile by id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User profile successfully found and return',
      type: UserEntity,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User profile not found',
    }),
    ApiParam({
      name: 'id',
      description: 'User ID',
      example: 'ef31f7cc-c862-4984-bf92-c94dc614bfb0',
      format: 'uuid',
    }),
  );
}
