import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CategoryType } from 'src/generated/prisma/enums';

export class CategoryEntity {
  @ApiProperty({
    description: 'Category ID',
    example: 'cb3af4d8-4319-4dd3-9d9b-89fd7a40b2b5',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Зарплата',
  })
  name: string;

  @ApiProperty({
    description: 'Category type',
    enum: CategoryType,
    example: CategoryType.INCOME,
  })
  type: CategoryType;

  @ApiProperty({
    description: 'Category color in HEX format',
    example: '#4CAF50',
    nullable: true,
  })
  colorHex: string | null;

  @ApiProperty({
    description: 'Icon key used to render the category icon on the client',
    example: 'lucide:briefcase',
    nullable: true,
  })
  iconKey: string | null;

  @ApiProperty({
    description: 'Date when the category was created',
    example: '2026-07-05T23:51:35.996Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the category was last updated',
    example: '2026-07-05T23:51:35.996Z',
  })
  updatedAt: Date;

  @Exclude()
  userId: string;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
