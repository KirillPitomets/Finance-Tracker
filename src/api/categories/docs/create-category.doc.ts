import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryEntity } from '../entities/category.entity';

export function ApiCreateCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new category',
      description: 'Create a new category for currently authenticated user',
    }),
    ApiBody({ type: CreateCategoryDto }),
    ApiCreatedResponse({
      description: 'Category created successfully',
      type: CategoryEntity,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Category with that name already created',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation failed',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized - token missing or expired',
    }),
    ApiBearerAuth(),
  );
}
