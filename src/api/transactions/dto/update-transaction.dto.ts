import { PickType, ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionAmountDto extends PickType(CreateTransactionDto, [
  'amount',
]) {}

export class UpdateTransactionNoteDto {
  @ApiProperty({ example: 'Updated note text' })
  @IsString()
  @Length(2, 256)
  note: string;
}
