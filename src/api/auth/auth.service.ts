import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { type Request, type Response } from 'express';
import ms, { StringValue } from 'ms';
import { UserService } from 'src/api/user/user.service';
import { jwtPayload } from 'src/common/interfaces';
import { isDev } from 'src/common/utils/is-dev.util';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { AuthConstants } from './constants/auth.constants';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthEntity } from './entities/auth.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private JWT_ACCESS_TOKEN_TTL: StringValue;
  private JWT_REFRESH_TOKEN_TTL: StringValue;
  private COOKIE_DOMAIN: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<StringValue>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<StringValue>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
  }
  // ==================== PUBLIC (Controller) ====================
  async me(userId: string): Promise<UserEntity> {
    return await this.userService.findByIdOrThrow(userId);
  }

  async register(
    res: Response,
    registerAuthDto: RegisterAuthDto,
  ): Promise<AuthEntity> {
    const { email, name, password } = registerAuthDto;

    const hashPassword = await hash(password);

    const user = await this.userService.createOrThrow(
      email,
      hashPassword,
      name,
    );

    return this.auth(res, user.id);
  }

  async login(res: Response, loginAuthDto: LoginAuthDto): Promise<AuthEntity> {
    const { email, password } = loginAuthDto;

    const user = await this.userService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const isValidPassword = await verify(user.hashPassword, password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    return this.auth(res, user.id);
  }

  async logout(res: Response) {
    this.setRefreshTokenToCookie(res, '', new Date(0));
    return true;
  }

  async delete(res: Response, userId: string) {
    await this.userService.findByIdOrThrow(userId);
    await this.userService.delete(userId);
    await this.logout(res);

    return true;
  }

  async refresh(req: Request, res: Response): Promise<AuthEntity> {
    const refreshToken = req.cookies[AuthConstants.COOKIE_REFRESH_TOKEN];

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      const payload: jwtPayload =
        await this.jwtService.verifyAsync(refreshToken);

      if (payload && payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.userId,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return this.auth(res, user.id);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // ==================== INTERNAL (Service-to-Service) ====================
  async validate(userId: string) {
    return this.userService.findByIdOrThrow(userId);
  }

  private auth(res: Response, userId: string): AuthEntity {
    const { accessToken, refreshToken } = this.generateTokens(userId);

    this.setRefreshTokenToCookie(
      res,
      refreshToken,
      new Date(Date.now() + ms(this.JWT_REFRESH_TOKEN_TTL)),
    );

    return new AuthEntity(accessToken);
  }

  private generateTokens(userId: string) {
    const refreshPayload: jwtPayload = { userId, type: 'refresh' };
    const accessPayload: jwtPayload = { userId, type: 'access' };

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private setRefreshTokenToCookie(res: Response, token: string, expires: Date) {
    res.cookie(AuthConstants.COOKIE_REFRESH_TOKEN, token, {
      expires,
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'none' : 'lax',
    });
  }
}
