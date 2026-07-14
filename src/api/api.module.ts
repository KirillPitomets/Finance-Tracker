import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { UserModule } from './user/user.module';
import { UserEmailModule } from './user/email/email.module';
import { UserPasswordModule } from './user/password/password.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CategoriesModule,
    AccountsModule,
    UserEmailModule,
    UserPasswordModule,
    TransactionsModule,
  ],
})
export class ApiModule {}
