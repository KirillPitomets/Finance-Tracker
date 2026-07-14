import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Authorization } from 'src/common/decorators/Authorization.decorator';
import { Authorized } from 'src/common/decorators/Authorized.decorator';
import { AccountsService } from './accounts.service';
import {
  ApiAccountCreation,
  ApiAccountDeletion,
  ApiFindAll,
  ApiFindById,
  ApiUpdateCurrency,
  ApiUpdateName,
  ApiUpdateType,
} from './docs';
import {
  AccountCurrencyUpdateDto,
  AccountNameUpdateDto,
  AccountTypeUpdateDto,
  CreateAccountDto,
} from './dto';
import { AccountEntity } from './entities/account.entity';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiAccountCreation()
  @Authorization()
  @Post()
  async create(
    @Authorized('id') userId: string,
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<AccountEntity> {
    return await this.accountsService.create(userId, createAccountDto);
  }

  @ApiFindAll()
  @Authorization()
  @Get()
  async findAll(@Authorized('id') userId: string): Promise<AccountEntity[]> {
    return await this.accountsService.findAll(userId);
  }

  @ApiFindById()
  @Authorization()
  @Get(':id')
  async findById(
    @Authorized('id') userId: string,
    @Param('id') id: string,
  ): Promise<AccountEntity> {
    return await this.accountsService.findByIdOrThrow(userId, id);
  }

  @ApiUpdateCurrency()
  @Authorization()
  @Patch(':id/currency')
  async updateCurrency(
    @Param('id') accountId: string,
    @Authorized('id') userId: string,
    @Body() dto: AccountCurrencyUpdateDto,
  ): Promise<AccountEntity> {
    return await this.accountsService.updateCurrency(userId, accountId, dto);
  }

  @ApiUpdateName()
  @Authorization()
  @Patch(':id/name')
  async updateName(
    @Param('id') accountId: string,
    @Authorized('id') userId: string,
    @Body() dto: AccountNameUpdateDto,
  ): Promise<AccountEntity> {
    return await this.accountsService.updateName(userId, accountId, dto);
  }

  @ApiUpdateType()
  @Authorization()
  @Patch(':id/type')
  async updateType(
    @Param('id') accountId: string,
    @Authorized('id') userId: string,
    @Body() dto: AccountTypeUpdateDto,
  ): Promise<AccountEntity> {
    return await this.accountsService.updateType(userId, accountId, dto);
  }

  @ApiAccountDeletion()
  @Authorization()
  @Delete(':id')
  async delete(@Authorized('id') userId: string, @Param('id') id: string) {
    return await this.accountsService.delete(userId, id);
  }
}
