import { Module } from '@nestjs/common';
import { ConfirmTokensService } from './confirm-token.service';

@Module({
  providers: [ConfirmTokensService],
  exports: [ConfirmTokensService],
})
export class ConfirmTokenModule {}
