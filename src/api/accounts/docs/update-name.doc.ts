import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AccountNameUpdateDto } from '../dto';
import { AccountEntity } from '../entities/account.entity';

export function ApiUpdateName() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update name',
      description: 'Update account name for authenticated user',
    }),
    ApiBody({ type: AccountNameUpdateDto }),
    ApiParam({
      name: 'id',
      description: 'Account ID',
      example: 'ef31f7cc-c862-4984-bf92-c94dc614bfb0',
      format: 'uuid',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Account name has been updated successfully',
      type: AccountEntity,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Account not found',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'User unauthorized',
    }),
    ApiBearerAuth(),
  );
}
