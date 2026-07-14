import { Module } from '@nestjs/common';
import { ConfirmTokenModule } from 'src/core/security/confirm-token/confirm-token.module';
import { MailModule } from 'src/infra/mail/mail.module';
import { UserModule } from '../user.module';
import { UserPasswordController } from './password.controller';
import { PasswordService } from './password.service';
import { AuthModule } from 'src/api/auth/auth.module';

@Module({
  imports: [ConfirmTokenModule, MailModule, UserModule, AuthModule],
  controllers: [UserPasswordController],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class UserPasswordModule {}
