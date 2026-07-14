import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import {
  AccountCurrencyUpdateDto,
  AccountNameUpdateDto,
  AccountTypeUpdateDto,
} from './dto';
import { AccountEntity } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    userId: string,
    createAccountDto: CreateAccountDto,
  ): Promise<AccountEntity> {
    const { name, currency, type } = createAccountDto;

    const existAccount = await this.prismaService.account.findUnique({
      where: { userId_name: { name, userId } },
    });

    if (existAccount) {
      throw new ConflictException('Account with that name already created');
    }

    const account = await this.prismaService.account.create({
      data: {
        name,
        type,
        currency,
        user: {
          connect: { id: userId },
        },
      },
    });

    return new AccountEntity(account);
  }

  async findAll(userId: string): Promise<AccountEntity[]> {
    const accounts = await this.prismaService.account.findMany({
      where: {
        userId,
      },
    });

    return accounts.map((account) => new AccountEntity(account));
  }

  async findById(userId: string, id: string) {
    return this.prismaService.account.findUnique({
      where: { id, userId },
    });
  }

  async findByIdOrThrow(userId: string, id: string): Promise<AccountEntity> {
    const account = await this.prismaService.account.findUnique({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return new AccountEntity(account);
  }

  async updateName(
    userId: string,
    accountId: string,
    dto: AccountNameUpdateDto,
  ): Promise<AccountEntity> {
    const { name } = dto;

    await this.findByIdOrThrow(userId, accountId);

    const updatedAccount = await this.prismaService.account.update({
      where: {
        id: accountId,
        userId,
      },
      data: {
        name,
      },
    });

    return new AccountEntity(updatedAccount);
  }

  async updateType(
    userId: string,
    accountId: string,
    dto: AccountTypeUpdateDto,
  ): Promise<AccountEntity> {
    const { type } = dto;

    await this.findByIdOrThrow(userId, accountId);
    await this.ensureAccountHasNoTransactions(accountId);

    const updatedAccount = await this.prismaService.account.update({
      where: {
        id: accountId,
        userId,
      },
      data: { type },
    });

    return new AccountEntity(updatedAccount);
  }

  async updateCurrency(
    userId: string,
    accountId: string,
    dto: AccountCurrencyUpdateDto,
  ): Promise<AccountEntity> {
    const { currency } = dto;

    await this.findByIdOrThrow(userId, accountId);
    await this.ensureAccountHasNoTransactions(accountId);

    const updatedAccount = await this.prismaService.account.update({
      where: {
        id: accountId,
        userId,
      },
      data: { currency: currency.toUpperCase() },
    });

    return new AccountEntity(updatedAccount);
  }

  async delete(userId: string, accountId: string) {
    const existAccount = await this.findByIdOrThrow(userId, accountId);

    await this.prismaService.account.delete({
      where: {
        userId: existAccount.userId,
        id: existAccount.id,
      },
    });

    return true;
  }

  private async ensureAccountHasNoTransactions(accountId: string) {
    const count = await this.prismaService.transaction.count({
      where: {
        accountId,
      },
    });

    if (count) {
      throw new BadRequestException(
        'Cannot change this fields because account has transactions',
      );
    }

    return true;
  }
}
