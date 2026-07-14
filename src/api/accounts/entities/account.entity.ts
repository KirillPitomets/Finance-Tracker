import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/client';
import { Exclude } from 'class-transformer';
import { Account, AccountType } from 'src/generated/prisma/client';

export class AccountEntity implements Account {
  @ApiProperty({
    description: 'Account ID',
    example: '679f43f6-a60a-47b1-b5f6-55ea54a7416b',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Account display name',
    example: 'card',
  })
  name: string;

  @ApiProperty({
    description: 'Account currency',
    example: 'USD',
  })
  currency: string;

  @ApiProperty({
    description: 'Account type',
    example: AccountType.BANK_ACCOUNT,
    enum: AccountType,
  })
  type: AccountType;

  @ApiProperty({
    description: 'Date of registered user',
    example: '2026-07-02T14:21:29.050Z',
  })
  createdAt: Date;
  @ApiProperty({
    description: 'Date last updated user',
    example: '2026-07-02T14:21:29.050Z',
  })
  updatedAt: Date;
  @Exclude()
  initialBalance: Decimal;
  @Exclude()
  userId: string;

  constructor(account: Account) {
    Object.assign(this, account);
  }
}
