import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { type Request, type Response } from 'express';
import { Authorization } from 'src/common/decorators/Authorization.decorator';
import { Authorized } from 'src/common/decorators/Authorized.decorator';
import { AuthService } from './auth.service';
import {
  ApiDelete,
  ApiLogin,
  ApiLogout,
  ApiMeProfile,
  ApiRefresh,
  ApiRegister,
} from './docs';
import { LoginAuthDto, RegisterAuthDto } from './dto';
import { UserEntity } from '../user/entities/user.entity';
import { AuthEntity } from './entities/auth.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiMeProfile()
  @Authorization()
  @Get('me')
  async me(@Authorized('id') userId: string): Promise<UserEntity> {
    return await this.authService.me(userId);
  }

  @ApiRegister()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() registerAuthDto: RegisterAuthDto,
  ): Promise<AuthEntity> {
    return await this.authService.register(res, registerAuthDto);
  }

  @ApiLogin()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginAuthDTO: LoginAuthDto,
  ): Promise<AuthEntity> {
    return await this.authService.login(res, loginAuthDTO);
  }

  @ApiLogout()
  @Authorization()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response): Promise<boolean> {
    return await this.authService.logout(res);
  }

  @ApiDelete()
  @Authorization()
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Res({ passthrough: true }) res: Response,
    @Authorized('id') userId: string,
  ): Promise<boolean> {
    return await this.authService.delete(res, userId);
  }

  @ApiRefresh()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthEntity> {
    return await this.authService.refresh(req, res);
  }
}
