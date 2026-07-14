import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateTransactionAmountDto } from '../dto/update-transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';

export function ApiCorrectTransactionAmount() {
  return applyDecorators(
    ApiOperation({
      summary: 'Correct transaction amount',
      description:
        'Transactions are immutable. This archives the original and creates a new corrected one.',
    }),
    ApiParam({ name: 'transactionId', format: 'uuid' }),
    ApiBody({ type: UpdateTransactionAmountDto }),
    ApiResponse({ status: HttpStatus.CREATED, type: TransactionEntity }),
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
