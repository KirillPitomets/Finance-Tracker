import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfirmTokenModule } from 'src/core/security/confirm-token/confirm-token.module';

@Module({
  imports: [ConfirmTokenModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
