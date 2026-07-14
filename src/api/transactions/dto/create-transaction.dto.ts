import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDecimal,
  IsOptional,
  IsString,
  Length,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { TransactionType } from 'src/generated/prisma/client';

export class CreateTransactionDto {
  @ApiProperty({ example: '150.00', type: 'string' })
  @IsDecimal()
  amount: string;

  @ApiPropertyOptional({ example: 'Groceries at supermarket' })
  @IsOptional()
  @IsString()
  @Length(2, 256)
  note?: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    example: 'ef31f7cc-c862-4984-bf92-c94dc614bfb0',
    format: 'uuid',
  })
  @IsUUID()
  categoryId: string;
}
