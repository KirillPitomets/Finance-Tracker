import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ConfirmEmailChangeDto, RequestChangeEmailDto } from './dto';
import { EmailService } from './email.service';
import { Authorization } from 'src/common/decorators/Authorization.decorator';
import { Authorized } from 'src/common/decorators/Authorized.decorator';
import { getExceptionMessage } from 'src/common/utils';
import { type Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { ApiRequestChange } from './docs/request-change.doc';
import { ApiConfirmChange } from './docs/confirm-change.doc';

@ApiTags('User')
@Controller('user/email')
export class UserEmailController {
  private clientAppUrl: string;
  constructor(
    private readonly EmailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    this.clientAppUrl = configService.getOrThrow<string>('CLIENT_APP_URL');
  }

  @ApiRequestChange()
  @Authorization()
  @Patch('request-change')
  @HttpCode(HttpStatus.ACCEPTED)
  async requestToChangeEmail(
    @Authorized('id') id: string,
    @Body() dto: RequestChangeEmailDto,
  ) {
    return await this.EmailService.requestToChangeEmail(id, dto);
  }

  @ApiConfirmChange()
  @Post('confirm-change')
  async confirmEmailChange(
    @Res({ passthrough: false }) res: Response,
    @Body() dto: ConfirmEmailChangeDto,
  ) {
    try {
      await this.EmailService.confirmEmailChange(dto);
      return res.redirect(
        HttpStatus.SEE_OTHER,
        `${this.clientAppUrl}/change-email-success`,
      );
    } catch (err) {
      const reason = getExceptionMessage(err);
      return res.redirect(
        HttpStatus.SEE_OTHER,
        `${this.clientAppUrl}/change-email-failed?reason=${encodeURIComponent(reason)}`,
      );
    }
  }
}
