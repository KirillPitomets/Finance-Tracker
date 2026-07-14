import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateTransactionNoteDto } from '../dto/update-transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';

export function ApiUpdateTransactionNote() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update transaction note',
      description:
        'Only the note can be edited. Amount changes require creating a correcting transaction.',
    }),
    ApiParam({ name: 'transactionId', format: 'uuid' }),
    ApiBody({ type: UpdateTransactionNoteDto }),
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
