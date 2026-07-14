import { Body, Controller, Patch, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { type Response } from 'express';
import { Authorization } from 'src/common/decorators/Authorization.decorator';
import { Authorized } from 'src/common/decorators/Authorized.decorator';
import { getExceptionMessage } from 'src/common/utils';
import {
  ApiConfirmChangeRequest,
  ApiPasswordResetRequest,
  ApiRequestChangePassword,
} from './docs';
import {
  ConfirmPasswordChangeDto,
  ConfirmPasswordResetDto,
  RequestChangePasswordDto,
} from './dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordService } from './password.service';
import { ApiConfirmReset } from './docs/confirm-reset.doc';

@ApiTags('User')
@Controller('user/password')
export class UserPasswordController {
  private clientAppUrl: string;
  constructor(
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {
    this.clientAppUrl = configService.getOrThrow<string>('CLIENT_APP_URL');
  }

  // ==================== Change password ====================
  @ApiRequestChangePassword()
  @Authorization()
  @Patch('request-change')
  async requestToChangePassword(
    @Authorized('id') id: string,
    @Body() dto: RequestChangePasswordDto,
  ) {
    return await this.passwordService.requestChange(id, dto);
  }

  @ApiConfirmChangeRequest()
  @Post('confirm-change')
  async confirmPasswordChange(
    @Res() res: Response,
    @Body() dto: ConfirmPasswordChangeDto,
  ) {
    try {
      await this.passwordService.confirmChange(res, dto);
      return res.redirect(`${this.clientAppUrl}/change-password-success`);
    } catch (err) {
      const reason = getExceptionMessage(err);
      return res.redirect(
        `${this.clientAppUrl}/change-password-failed?reason=${encodeURIComponent(reason)}`,
      );
    }
  }

  // ==================== Reset password ====================
  @ApiPasswordResetRequest()
  @Post('request-reset')
  async requestPasswordReset(@Body() dto: PasswordResetRequestDto) {
    return await this.passwordService.requestReset(dto);
  }

  @ApiConfirmReset()
  @Patch('confirm-reset')
  async confirmPasswordReset(
    @Res() res: Response,
    @Body() dto: ConfirmPasswordResetDto,
  ) {
    try {
      await this.passwordService.confirmReset(dto);
      return res.redirect(`${this.clientAppUrl}/password-reset-success`);
    } catch (err) {
      const reason = getExceptionMessage(err);
      return res.redirect(
        `${this.clientAppUrl}/password-reset-failed?reason=${encodeURIComponent(reason)}`,
      );
    }
  }
}
