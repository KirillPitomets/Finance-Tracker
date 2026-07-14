import { Module } from '@nestjs/common';
import { UserModule } from 'src/api/user/user.module';
import { EmailService } from './email.service';
import { MailModule } from 'src/infra/mail/mail.module';
import { UserPasswordModule } from '../password/password.module';
import { ConfirmTokenModule } from 'src/core/security/confirm-token/confirm-token.module';
import { UserEmailController } from './email.controller';

@Module({
  imports: [UserModule, MailModule, UserPasswordModule, ConfirmTokenModule],
  controllers: [UserEmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class UserEmailModule {}
