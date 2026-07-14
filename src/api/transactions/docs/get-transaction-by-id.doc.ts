import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransactionEntity } from '../entities/transaction.entity';

export function ApiGetTransactionById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get transaction by ID' }),
    ApiParam({ name: 'id', description: 'Transaction ID', format: 'uuid' }),
    ApiResponse({ status: HttpStatus.OK, type: TransactionEntity }),
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
