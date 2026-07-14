import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AccountEntity } from '../entities/account.entity';
import { CreateAccountDto } from '../dto';

export function ApiAccountCreation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a financial account',
      description: 'Create a new financial account for the authenticated user',
    }),
    ApiBody({ type: CreateAccountDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Financial account successfully created',
      type: AccountEntity,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'User unauthorized',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Account with that name already created',
    }),
    ApiBearerAuth(),
  );
}
