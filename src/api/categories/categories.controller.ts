import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Authorization } from 'src/common/decorators/Authorization.decorator';
import { Authorized } from 'src/common/decorators/Authorized.decorator';
import { CategoriesService } from './categories.service';
import { ApiCreateCategory } from './docs/create-category.doc';
import { ApiDeleteCategory } from './docs/delete-category.doc';
import { ApiGetAllCategories } from './docs/get-all-categories.doc';
import { ApiGetCategoryById } from './docs/get-category-by-id.doc';
import { ApiUpdateCategoryColor } from './docs/update-category-color.doc';
import { ApiUpdateCategoryIcon } from './docs/update-category-icon.doc';
import { ApiUpdateCategoryName } from './docs/update-category-name.doc';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  UpdateCategoryColorDto,
  UpdateCategoryIconDto,
  UpdateCategoryNameDto,
} from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiCreateCategory()
  @Authorization()
  @Post()
  async create(
    @Authorized('id') userId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return await this.categoriesService.create(userId, dto);
  }

  @ApiGetAllCategories()
  @Authorization()
  @Get()
  async getAll(@Authorized('id') userId: string) {
    return await this.categoriesService.getAll(userId);
  }

  @ApiGetCategoryById()
  @Authorization()
  @Get(':id')
  async getById(
    @Authorized('id') userId: string,
    @Param('id') categoryId: string,
  ) {
    return await this.categoriesService.findByIdOrThrow(userId, categoryId);
  }

  @ApiUpdateCategoryName()
  @Authorization()
  @Patch(':id/name')
  async updateName(
    @Authorized('id') userId: string,
    @Param('id') categoryId: string,
    @Body() dto: UpdateCategoryNameDto,
  ) {
    return await this.categoriesService.updateName(userId, categoryId, dto);
  }

  @ApiUpdateCategoryIcon()
  @Authorization()
  @Patch(':id/icon')
  async updateIcon(
    @Authorized('id') userId: string,
    @Param('id') categoryId: string,
    @Body() dto: UpdateCategoryIconDto,
  ) {
    return await this.categoriesService.updateIcon(userId, categoryId, dto);
  }

  @ApiUpdateCategoryColor()
  @Authorization()
  @Patch(':id/color')
  async updateColor(
    @Authorized('id') userId: string,
    @Param('id') categoryId: string,
    @Body() dto: UpdateCategoryColorDto,
  ) {
    return await this.categoriesService.updateColor(userId, categoryId, dto);
  }

  @ApiDeleteCategory()
  @Authorization()
  @Delete(':id')
  async delete(
    @Authorized('id') userId: string,
    @Param('id') categoryId: string,
  ) {
    return await this.categoriesService.delete(userId, categoryId);
  }
}
