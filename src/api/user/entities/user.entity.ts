import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/generated/prisma/client';

export class UserEntity implements User {
  @ApiProperty({
    description: 'User ID',
    example: '679f43f6-a60a-47b1-b5f6-55ea54a7416b',
    format: 'uuid',
  })
  id: string;
  @ApiProperty({
    description: 'User display name',
    example: 'John',
  })
  name: string;
  @ApiProperty({
    description: 'User email',
    example: 'john@example.com',
    format: 'email',
  })
  email: string;
  @ApiProperty({
    description: 'Date of registered user',
    example: '2026-07-02T14:21:29.050Z',
  })
  createdAt: Date;
  @ApiProperty({
    description: 'Date last updated user',
    example: '2026-07-02T14:21:29.050Z',
  })
  updatedAt: Date;

  @Exclude()
  hashPassword: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
