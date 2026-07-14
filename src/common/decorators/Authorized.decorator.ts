import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { type User } from 'src/generated/prisma/client';

export const Authorized = createParamDecorator(
  (data: keyof User, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest() as Request;
    const user = request.user;
    return data ? user![data] : user;
  },
);
