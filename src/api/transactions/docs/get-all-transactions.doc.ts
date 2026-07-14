import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransactionEntity } from '../entities/transaction.entity';

export function ApiGetAllTransactions() {
  return applyDecorators(
    ApiOperation({ summary: 'Get paginated list of transactions' }),
    ApiQuery({ name: 'page', required: false, example: 1, type: Number }),
    ApiQuery({ name: 'limit', required: false, example: 20, type: Number }),
    ApiResponse({ status: HttpStatus.OK, type: [TransactionEntity] }), // [] - массив
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiBearerAuth(),
  );
}
