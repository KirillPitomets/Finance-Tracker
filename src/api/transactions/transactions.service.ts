import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  UpdateTransactionAmountDto,
  UpdateTransactionNoteDto,
} from './dto/update-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(
    userId: string,
    accountId: string,
    dto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    const { amount, categoryId, type, note } = dto;

    const category = await this.categoriesService.findByIdOrThrow(
      userId,
      categoryId,
    );

    if (category.type !== type) {
      throw new BadRequestException('Transaction type is invalid');
    }

    const transaction = await this.prismaService.$transaction(async (tx) => {
      return tx.transaction.create({
        data: {
          amount,
          categoryId,
          type,
          note,
          userId,
          accountId,
        },
      });
    });

    return new TransactionEntity(transaction);
  }

  async getAll(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<TransactionEntity[]> {
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        userId,
        archivedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return transactions.map(
      (transaction) => new TransactionEntity(transaction),
    );
  }

  async getById(userId: string, id: string): Promise<TransactionEntity> {
    const transaction = await this.findByIdOrThrow(userId, id);
    return new TransactionEntity(transaction);
  }

  async updateNote(
    userId: string,
    id: string,
    dto: UpdateTransactionNoteDto,
  ): Promise<TransactionEntity> {
    const { note } = dto;

    await this.findByIdOrThrow(userId, id);

    const transaction = await this.prismaService.transaction.update({
      where: { id },
      data: { note },
    });

    return new TransactionEntity(transaction);
  }

  async correctAmount(
    userId: string,
    id: string,
    dto: UpdateTransactionAmountDto,
  ): Promise<TransactionEntity> {
    const { amount } = dto;
    const original = await this.findByIdOrThrow(userId, id);

    const transaction = await this.prismaService.$transaction(async (tx) => {
      await tx.transaction.update({
        where: { id },
        data: { archivedAt: new Date() },
      });

      return tx.transaction.create({
        data: {
          amount,
          note: original.note,
          categoryId: original.categoryId,
          type: original.type,
          accountId: original.accountId,
          userId,
          correctionOfId: original.id,
        },
      });
    });

    return new TransactionEntity(transaction);
  }

  async delete(userId: string, id: string): Promise<TransactionEntity> {
    await this.findByIdOrThrow(userId, id);

    const transaction = await this.prismaService.transaction.update({
      where: { id },
      data: {
        archivedAt: new Date(),
      },
    });

    return new TransactionEntity(transaction);
  }

  // ==================== Service-to-Service ====================

  private async findById(userId: string, id: string) {
    return this.prismaService.transaction.findUnique({
      where: {
        userId,
        id,
        archivedAt: null,
      },
    });
  }

  async findByIdOrThrow(userId: string, id: string) {
    const transaction = await this.findById(userId, id);

    if (!transaction) {
      throw new NotFoundException('Not found transaction');
    }

    return transaction;
  }
}
