import { PickType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';

export class AccountNameUpdateDto extends PickType(CreateAccountDto, [
  'name',
]) {}
export class AccountCurrencyUpdateDto extends PickType(CreateAccountDto, [
  'currency',
]) {}
export class AccountTypeUpdateDto extends PickType(CreateAccountDto, [
  'type',
]) {}
