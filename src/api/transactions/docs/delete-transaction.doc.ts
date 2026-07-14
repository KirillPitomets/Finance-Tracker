import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function ApiDeleteTransaction() {
  return applyDecorators(
    ApiOperation({
      summary: 'Archive transaction',
      description:
        'Soft delete - sets archivedAt timestamp. Transaction is excluded from all queries.',
    }),
    ApiParam({ name: 'transactionId', format: 'uuid' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Transaction archived successfully',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Transaction not found',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiBearerAuth(),
  );
}
