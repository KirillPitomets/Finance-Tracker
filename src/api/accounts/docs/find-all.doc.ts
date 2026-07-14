import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccountEntity } from '../entities/account.entity';

export function ApiFindAll() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find all accounts',
      description: 'Find all financial accounts for the authenticated user',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Find all finance account for the authenticated user',
      type: [AccountEntity],
    }),
    ApiBearerAuth(),
  );
}
