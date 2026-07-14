import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';

export function ApiCreateTransaction() {
  return applyDecorators(
    ApiOperation({ summary: 'Create transaction for account' }),
    ApiParam({ name: 'accountId', description: 'Account ID', format: 'uuid' }),
    ApiBody({ type: CreateTransactionDto }),
    ApiResponse({ status: HttpStatus.CREATED, type: TransactionEntity }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Transaction type does not match category type',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Category not found',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiBearerAuth(),
  );
}
