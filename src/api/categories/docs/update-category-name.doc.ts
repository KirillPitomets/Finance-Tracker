import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateCategoryNameDto } from '../dto/update-category.dto';
import { CategoryEntity } from '../entities/category.entity';

export function ApiUpdateCategoryName() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update category name',
      description: 'Updates the category name for currently authenticated user',
    }),
    ApiOkResponse({
      description: 'Category name successfully updated',
      type: CategoryEntity,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Category not found',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation failed',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Category with that name already exist',
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
    ApiBody({ type: UpdateCategoryNameDto }),
    ApiBearerAuth(),
  );
}
