import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import {
  CreateCategoryDto,
  UpdateCategoryNameDto,
  UpdateCategoryIconDto,
  UpdateCategoryColorDto,
} from './dto';
import { CategoryEntity } from './entities/category.entity';
@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  // ==================== Public ====================
  async create(
    userId: string,
    dto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const { name, type, iconKey, color } = dto;

    const existing = await this.prismaService.category.findFirst({
      where: { userId, name },
    });

    if (existing) {
      throw new ConflictException('Category with that name already created');
    }

    const category = await this.prismaService.category.create({
      data: {
        userId,
        name,
        type,
        colorHex: color,
        iconKey,
      },
    });

    return new CategoryEntity(category);
  }

  async updateName(
    userId: string,
    id: string,
    dto: UpdateCategoryNameDto,
  ): Promise<CategoryEntity> {
    const { name } = dto;

    await this.findByIdOrThrow(userId, id);

    const existing = await this.prismaService.category.findFirst({
      where: { userId, name, NOT: { id } },
    });

    if (existing) {
      throw new ConflictException('Category already exists');
    }

    const category = await this.updateField(id, { name });
    return new CategoryEntity(category);
  }

  async updateIcon(
    userId: string,
    id: string,
    dto: UpdateCategoryIconDto,
  ): Promise<CategoryEntity> {
    await this.findByIdOrThrow(userId, id);
    const category = await this.updateField(id, { iconKey: dto.iconKey });
    return new CategoryEntity(category);
  }

  async updateColor(
    userId: string,
    id: string,
    dto: UpdateCategoryColorDto,
  ): Promise<CategoryEntity> {
    await this.findByIdOrThrow(userId, id);
    const category = await this.updateField(id, { colorHex: dto.color });
    return new CategoryEntity(category);
  }

  async delete(userId: string, id: string) {
    await this.findByIdOrThrow(userId, id);

    await this.prismaService.category.delete({
      where: { id },
    });

    return { success: true };
  }

  async getById(userId: string, id: string): Promise<CategoryEntity> {
    const category = await this.findByIdOrThrow(userId, id);
    return new CategoryEntity(category);
  }

  async getAll(userId: string): Promise<CategoryEntity[]> {
    const categories = await this.prismaService.category.findMany({
      where: { userId },
    });

    return categories.map((category) => new CategoryEntity(category));
  }

  // ==================== Service-to-Service ====================

  async findById(userId: string, id: string) {
    return this.prismaService.category.findUnique({
      where: { id, userId },
    });
  }

  async findByIdOrThrow(userId: string, id: string) {
    const category = await this.findById(userId, id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  // ==================== Private ====================

  private async updateField(id: string, data: Prisma.CategoryUpdateInput) {
    return this.prismaService.category.update({
      where: { id },
      data,
    });
  }
}
