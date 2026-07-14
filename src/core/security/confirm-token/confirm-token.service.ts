import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { ConfirmTokenEnum } from 'src/generated/prisma/enums';
import { ConfirmToken } from 'src/generated/prisma/client';
import { CONFIRM_TOKEN_BYTES } from './constants';
import {
  EmailChangePayload,
  isEmailChangePayload,
  isPasswordChangePayload,
  PasswordChangePayload,
} from './types';

@Injectable()
export class ConfirmTokensService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByIdOrThrow(tokenId: string) {
    const token = await this.prismaService.confirmToken.findUnique({
      where: {
        id: tokenId,
      },
    });

    if (!token) {
      throw new NotFoundException('Confirm token not found');
    }

    return token;
  }

  async findByTokenHashOrThrow(tokenHash: string) {
    const confirmToken = await this.prismaService.confirmToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (!confirmToken) {
      throw new UnauthorizedException('Invalid token');
    }

    return confirmToken;
  }

  async createEmailConfirmToken(userId: string, newEmail: string) {
    const token = this.generateConfirmToken();
    const tokenHash = this.hashToken(token);

    const emailPayload: EmailChangePayload = { newEmail };

    await this.prismaService.confirmToken.create({
      data: {
        tokenHash,
        type: 'EMAIL_CHANGE',
        payload: emailPayload,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15),
      },
    });

    return token;
  }

  async createPasswordConfirmToken(userId: string, newHashPassword: string) {
    const token = this.generateConfirmToken();
    const tokenHash = this.hashToken(token);

    const passwordPayload: PasswordChangePayload = { newHashPassword };

    await this.prismaService.confirmToken.create({
      data: {
        tokenHash,
        type: 'PASSWORD_CHANGE',
        expiresAt: new Date(Date.now() + 1000 * 60 * 15),
        payload: passwordPayload,
        user: {
          connect: { id: userId },
        },
      },
    });

    return token;
  }

  async createPasswordResetToken(userId: string) {
    const token = this.generateConfirmToken();
    const tokenHash = this.hashToken(token);

    await this.prismaService.confirmToken.create({
      data: {
        tokenHash,
        type: 'PASSWORD_RESET',
        user: {
          connect: { id: userId },
        },
        expiresAt: new Date(Date.now() + 1000 * 60 * 15),
      },
    });

    return token;
  }

  async verifyToken(token: string, type: ConfirmTokenEnum) {
    const confirmToken = await this.verify(token);

    if (confirmToken.type !== type) {
      throw new UnauthorizedException('Invalid token type');
    }

    return confirmToken;
  }

  getEmailChangePayload(token: ConfirmToken) {
    const payload = token.payload;

    if (!isEmailChangePayload(payload)) {
      throw new BadRequestException('Email is missing');
    }

    return payload.newEmail;
  }

  getPasswordChangePayloadOrThrow(token: ConfirmToken) {
    const payload = token.payload;

    if (!isPasswordChangePayload(payload)) {
      throw new BadRequestException('Password is missing');
    }

    return payload.newHashPassword;
  }

  hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  async verify(token: string) {
    const tokenHash = this.hashToken(token);
    const confirmToken = await this.findByTokenHashOrThrow(tokenHash);

    if (confirmToken.usedAt) {
      throw new BadRequestException('Token already used');
    }

    if (confirmToken.expiresAt < new Date()) {
      throw new BadRequestException('Token expired');
    }

    return confirmToken;
  }

  async markAsUsed(tokenId: string) {
    return await this.prismaService.confirmToken.update({
      where: { id: tokenId },
      data: {
        usedAt: new Date(),
      },
    });
  }

  private generateConfirmToken() {
    return randomBytes(CONFIRM_TOKEN_BYTES).toString('hex');
  }
}
