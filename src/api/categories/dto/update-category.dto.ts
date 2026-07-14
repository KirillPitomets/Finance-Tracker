import { PickType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryColorDto extends PickType(CreateCategoryDto, [
  'color',
] as const) {}

export class UpdateCategoryNameDto extends PickType(CreateCategoryDto, [
  'name',
] as const) {}

export class UpdateCategoryIconDto extends PickType(CreateCategoryDto, [
  'iconKey',
] as const) {}
