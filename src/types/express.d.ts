import { type User } from 'src/generated/prisma/client';

declare global {
  namespace Exrpess {
    interface Request {
      user: User;
    }
  }
}

export {};
