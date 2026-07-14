import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsISO4217CurrencyCode,
  IsString,
  Length,
} from 'class-validator';
import { AccountType } from 'src/generated/prisma/enums';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Finance account unique name',
    example: 'Main card',
    minLength: 5,
    maxLength: 16,
    uniqueItems: true,
  })
  @IsString()
  @Length(5, 16)
  name: string;

  @ApiProperty({
    description: 'Finance account type',
    example: AccountType.BANK_CARD,
    enum: AccountType,
  })
  @IsEnum(AccountType)
  type: AccountType;

  @ApiProperty({
    example: 'USD',
  })
  @IsString()
  @IsISO4217CurrencyCode()
  currency: string;
}
