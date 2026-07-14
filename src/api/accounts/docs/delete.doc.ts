import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiAccountDeletion() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete the finance account by ID',
      description: 'Delete the finance account by ID for authenticated user',
    }),
    ApiParam({
      name: 'id',
      description: 'Account ID',
      example: 'ef31f7cc-c862-4984-bf92-c94dc614bfb0',
      format: 'uuid',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Finance account successfully delete',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Not found finance account',
    }),
  );
}
