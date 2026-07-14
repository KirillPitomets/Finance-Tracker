import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import {
  CategoryType,
  AccountType,
  TransactionType,
} from '../src/generated/prisma/enums';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding started...');

  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.confirmToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  const user = await prisma.user.create({
    data: {
      name: 'Kirill Dev',
      email: 'kirill@test.com',
      hashPassword:
        '$argon2id$v=19$m=65536,t=3,p=4$ozh3XMoPOvIElsY/8VF+CA$48a2t+EXqlEiSHnvRhemg+mD/eZlY3mVILDzKz6SaCU',
      // password - so_Strong_password123
    },
  });

  console.log(`👤 Created user: ${user.email}`);

  const [salaryCategory, freelanceCategory, foodCategory, transportCategory] =
    await Promise.all([
      prisma.category.create({
        data: {
          name: 'Зарплата',
          type: CategoryType.INCOME,
          colorHex: '#4CAF50',
          iconKey: 'lucide:briefcase',
          userId: user.id,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Фриланс',
          type: CategoryType.INCOME,
          colorHex: '#2196F3',
          iconKey: 'lucide:laptop',
          userId: user.id,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Продукты',
          type: CategoryType.EXPENSE,
          colorHex: '#FF5722',
          iconKey: 'lucide:shopping-cart',
          userId: user.id,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Транспорт',
          type: CategoryType.EXPENSE,
          colorHex: '#9C27B0',
          iconKey: 'lucide:car',
          userId: user.id,
        },
      }),
    ]);

  console.log('📂 Created categories');

  const account = await prisma.account.create({
    data: {
      name: 'Основная карта',
      type: AccountType.BANK_CARD,
      initialBalance: '1000.00',
      currency: 'USD',
      userId: user.id,
    },
  });

  console.log(`💳 Created account: ${account.name}`);

  await Promise.all([
    prisma.transaction.create({
      data: {
        amount: '2500.00',
        type: TransactionType.INCOME,
        note: 'Зарплата за июнь',
        userId: user.id,
        accountId: account.id,
        categoryId: salaryCategory.id,
      },
    }),
    prisma.transaction.create({
      data: {
        amount: '500.00',
        type: TransactionType.INCOME,
        note: 'Проект на фрилансе',
        userId: user.id,
        accountId: account.id,
        categoryId: freelanceCategory.id,
      },
    }),
    prisma.transaction.create({
      data: {
        amount: '85.50',
        type: TransactionType.EXPENSE,
        note: 'Супермаркет',
        userId: user.id,
        accountId: account.id,
        categoryId: foodCategory.id,
      },
    }),
    prisma.transaction.create({
      data: {
        amount: '20.00',
        type: TransactionType.EXPENSE,
        note: 'Такси',
        userId: user.id,
        accountId: account.id,
        categoryId: transportCategory.id,
      },
    }),
  ]);

  console.log('💰 Created transactions');
  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
