import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { type Response } from 'express';
import { AuthService } from 'src/api/auth/auth.service';
import { ConfirmTokensService } from 'src/core/security/confirm-token/confirm-token.service';
import { MailService } from 'src/infra/mail/mail.service';
import { UserService } from '../user.service';
import {
  ConfirmPasswordChangeDto,
  ConfirmPasswordResetDto,
  PasswordResetRequestDto,
  RequestChangePasswordDto,
} from './dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

@Injectable()
export class PasswordService {
  constructor(
    private readonly userService: UserService,
    private readonly confirmTokenService: ConfirmTokensService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) {}

  async requestChange(
    userId: string,
    dto: RequestChangePasswordDto,
  ): Promise<SuccessResponseDto> {
    const { newPassword, confirmNewPassword, currentPassword } = dto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userService.findByIdWithPasswordOrThrow(userId);
    await this.verifyOrThrow(user.hashPassword, currentPassword);

    const hashPassword = await hash(newPassword);
    const token = await this.confirmTokenService.createPasswordConfirmToken(
      user.id,
      hashPassword,
    );

    await this.mailService.sendPasswordChangeConfirmation(user.email, token);

    return { message: 'Confirmation email has been sent' };
  }

  async confirmChange(res: Response, dto: ConfirmPasswordChangeDto) {
    const { token } = dto;
    const confirmToken = await this.confirmTokenService.verifyToken(
      token,
      'PASSWORD_CHANGE',
    );
    const newHashPassword =
      this.confirmTokenService.getPasswordChangePayloadOrThrow(confirmToken);

    const user = await this.userService.findByIdWithPasswordOrThrow(
      confirmToken.userId,
    );

    await this.userService.updatePassword(user.id, newHashPassword);
    await this.confirmTokenService.markAsUsed(confirmToken.id);
    await this.authService.logout(res);
    return true;
  }

  async requestReset(dto: PasswordResetRequestDto) {
    const { email } = dto;
    const user = await this.userService.findByEmailOrThrow(email);

    const token = await this.confirmTokenService.createPasswordResetToken(
      user.id,
    );

    await this.mailService.sendPasswordResetConfirmation(user.email, token);

    return true;
  }

  async confirmReset(dto: ConfirmPasswordResetDto) {
    const { token, password } = dto;
    const confirmToken = await this.confirmTokenService.verifyToken(
      token,
      'PASSWORD_RESET',
    );

    const user = await this.userService.findByIdWithPasswordOrThrow(
      confirmToken.userId,
    );

    const newHashPassword = await hash(password);

    await this.userService.updatePassword(user.id, newHashPassword);
    await this.confirmTokenService.markAsUsed(confirmToken.id);

    return true;
  }

  private async verifyOrThrow(
    hashPassword: string,
    password: string,
    errorMessage?: string,
  ) {
    const isPasswordValid = await verify(hashPassword, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        errorMessage ? errorMessage : 'Password is incorrect',
      );
    }

    return true;
  }
}
