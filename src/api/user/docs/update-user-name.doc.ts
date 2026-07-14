import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateUsernameDto } from '../dto';
import { UserEntity } from '../entities/user.entity';

export function ApiUpdateUserName() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update name for current user',
      description: 'Update name for currently authenticated user',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Username successfully updated',
      type: UserEntity,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'User is not authenticated',
    }),
    ApiBody({ type: UpdateUsernameDto }),
    ApiBearerAuth(),
  );
}
