import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AccountEntity } from '../entities/account.entity';

export function ApiFindById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find the finance account by ID',
      description: 'Find the finance account by ID for authenticated user',
    }),
    ApiParam({
      name: 'id',
      description: 'Account ID',
      example: 'ef31f7cc-c862-4984-bf92-c94dc614bfb0',
      format: 'uuid',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Find account by ID',
      type: AccountEntity,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Not found account by ID',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'User unauthorized',
    }),
    ApiBearerAuth(),
  );
}
