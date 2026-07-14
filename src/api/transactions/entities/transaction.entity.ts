import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/client';
import { Exclude } from 'class-transformer';
import { TransactionType, Transaction } from 'src/generated/prisma/client';

export class TransactionEntity implements Transaction {
  @ApiProperty({ example: 'ef31f7cc-c862-4984-bf92-c94dc614bfb0' })
  id: string;

  @ApiProperty({ example: '150.00', type: 'string' })
  amount: Decimal;

  @ApiPropertyOptional({ example: 'Groceries at supermarket' })
  note: string | null;

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  type: TransactionType;

  @ApiPropertyOptional({ example: null, nullable: true })
  archivedAt: Date | null;

  @ApiPropertyOptional({
    description: 'ID of the original transaction this one corrects, if any',
    example: null,
    nullable: true,
  })
  correctionOfId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  accountId: string;

  @Exclude()
  categoryId: string;

  @Exclude()
  userId: string;

  constructor(partial: Partial<TransactionEntity>) {
    Object.assign(this, partial);
  }
}
