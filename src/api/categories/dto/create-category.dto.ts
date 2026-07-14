import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { CategoryType } from 'src/generated/prisma/enums';
import { COLOR_HEX_PATTERN, ICON_KEY_PATTERN } from '../constants/patterns';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name. Must contain between 2 and 16 characters',
    example: 'Subscriptions',
    minLength: 2,
    maxLength: 16,
  })
  @IsString()
  @Length(2, 16)
  @Transform(
    ({ value }) => typeof value === 'string' && value.trim().toLowerCase(),
  )
  name: string;

  @ApiProperty({
    enum: CategoryType,
    example: CategoryType.INCOME,
    description: 'Category type INCOME or EXPENSE',
  })
  @IsNotEmpty()
  @IsEnum(CategoryType)
  type: CategoryType;

  @ApiPropertyOptional({
    description: 'The category color in HEX format',
    example: '#FFFFFF',
    pattern: COLOR_HEX_PATTERN,
  })
  @IsString()
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiPropertyOptional({
    description: 'The category icon key in the format "library:icon".',
    example: 'lucide:wallet',
    pattern: ICON_KEY_PATTERN,
  })
  @IsString()
  @IsOptional()
  @Matches(ICON_KEY_PATTERN, {
    message: 'iconKey must be in format "library:icon"',
  })
  iconKey?: string;
}
