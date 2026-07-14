import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiDeleteCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete category',
      description: 'Delete the category for currently authenticated user',
    }),
    ApiOkResponse({
      description: 'Category successfully deleted',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Category not found',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized - token missing or expired',
    }),
    ApiParam({
      name: 'id',
      description: 'Category ID',
      required: true,
      example: 'cb3af4d8-4319-4dd3-9d9b-89fd7a40b2b5',
      format: 'uuid',
    }),
    ApiBearerAuth(),
  );
}
