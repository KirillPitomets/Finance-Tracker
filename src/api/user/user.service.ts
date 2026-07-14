import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { Prisma } from 'src/generated/prisma/client';
import { UpdateUsernameDto } from './dto/update-profile.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  // ==================== PUBLIC (Controller) ====================
  async updateUsername(
    userId: string,
    dto: UpdateUsernameDto,
  ): Promise<UserEntity> {
    const { name } = dto;

    try {
      const user = await this.prismaService.user.update({
        where: { id: userId },
        data: {
          name,
        },
      });

      return new UserEntity(user);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }
      throw err;
    }
  }

  // ==================== INTERNAL (Service-to-Service) ====================
  async createOrThrow(
    email: string,
    hashPassword: string,
    name: string,
  ): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.create({
        data: { email, name, hashPassword },
      });

      return new UserEntity(user);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException('User with that email already exist');
        }
      }
      throw err;
    }
  }

  async updateEmail(userId: string, email: string): Promise<UserEntity> {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { email },
      omit: { hashPassword: true },
    });

    return new UserEntity(user);
  }

  async updatePassword(
    userId: string,
    hashPassword: string,
  ): Promise<UserEntity> {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { hashPassword },
      omit: { hashPassword: true },
    });

    return new UserEntity(user);
  }

  async delete(userId: string) {
    const user = await this.findByIdOrThrow(userId);

    await this.prismaService.user.delete({ where: { id: user.id } });

    return true;
  }

  // ==================== QUIRES ====================

  async findByIdOrThrow(userId: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserEntity(user);
  }

  async findById(userId: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      omit: { hashPassword: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserEntity(user);
  }

  async findByEmailOrThrow(email: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      omit: { hashPassword: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserEntity(user);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      omit: { hashPassword: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserEntity(user);
  }

  async findByIdWithPasswordOrThrow(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Not found user');
    }

    return user;
  }

  async findByEmailWithPassword(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }
}
