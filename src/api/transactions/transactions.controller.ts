import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  ValidationPipe,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Authorization, Authorized } from 'src/common/decorators';
import {
  ApiCreateTransaction,
  ApiGetAllTransactions,
  ApiGetTransactionById,
  ApiUpdateTransactionNote,
  ApiCorrectTransactionAmount,
  ApiDeleteTransaction,
} from './docs';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindAllTransactionsQueryDto } from './dto/find-all-transactions-query.dto';
import {
  UpdateTransactionNoteDto,
  UpdateTransactionAmountDto,
} from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiCreateTransaction()
  @Authorization()
  @Post(':accountId')
  async create(
    @Authorized('id') userId: string,
    @Param('accountId') accountId: string,
    @Body() dto: CreateTransactionDto,
  ) {
    return await this.transactionsService.create(userId, accountId, dto);
  }

  @ApiGetAllTransactions()
  @Authorization()
  @Get()
  async getAll(
    @Authorized('id') userId: string,
    @Query(new ValidationPipe({ transform: true }))
    query: FindAllTransactionsQueryDto,
  ) {
    return await this.transactionsService.getAll(
      userId,
      query.page,
      query.limit,
    );
  }

  @ApiGetTransactionById()
  @Authorization()
  @Get(':id')
  async getById(
    @Authorized('id') userId: string,
    @Param('id') transactionId: string,
  ) {
    return await this.transactionsService.findByIdOrThrow(
      userId,
      transactionId,
    );
  }

  @ApiUpdateTransactionNote()
  @Authorization()
  @Patch(':transactionId/note')
  async updateNote(
    @Authorized('id') userId: string,
    @Param('transactionId') transactionId: string,
    @Body() dto: UpdateTransactionNoteDto,
  ) {
    return await this.transactionsService.updateNote(
      userId,
      transactionId,
      dto,
    );
  }

  @ApiCorrectTransactionAmount()
  @Authorization()
  @Post(':transactionId/amount')
  async correctAmount(
    @Authorized('id') userId: string,
    @Param('transactionId') transactionId: string,
    @Body() dto: UpdateTransactionAmountDto,
  ) {
    return await this.transactionsService.correctAmount(
      userId,
      transactionId,
      dto,
    );
  }

  @ApiDeleteTransaction()
  @Authorization()
  @Delete(':transactionId')
  async delete(
    @Authorized('id') userId: string,
    @Param('transactionId') transactionId: string,
  ) {
    return await this.transactionsService.delete(userId, transactionId);
  }
}
