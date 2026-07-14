import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CategoryEntity } from '../entities/category.entity';

export function ApiGetAllCategories() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve all categories',
      description: 'Retrieves all categories for currently authenticated user',
    }),
    ApiOkResponse({
      description: 'Categories successfully returned',
      type: CategoryEntity,
      isArray: true,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized - token missing or expired',
    }),
    ApiBearerAuth(),
  );
}
