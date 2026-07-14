import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CategoryEntity } from '../entities/category.entity';

export function ApiGetCategoryById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Return category by ID',
      description: 'Returns category by ID for authenticated user',
    }),
    ApiOkResponse({
      description: 'Category successfully returned',
      type: CategoryEntity,
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
