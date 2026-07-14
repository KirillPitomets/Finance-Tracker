import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/api/user/user.service';
import { MailService } from 'src/infra/mail/mail.service';
import { PasswordService } from '../password/password.service';
import { ConfirmTokensService } from 'src/core/security/confirm-token/confirm-token.service';
import { ConfirmEmailChangeDto, RequestChangeEmailDto } from './dto';
import { verify } from 'argon2';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

@Injectable()
export class EmailService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly passwordService: PasswordService,
    private readonly confirmTokenService: ConfirmTokensService,
  ) {}

  async requestToChangeEmail(
    userId: string,
    dto: RequestChangeEmailDto,
  ): Promise<SuccessResponseDto> {
    const { email, password } = dto;
    const user = await this.userService.findByIdWithPasswordOrThrow(userId);

    const isValidPassword = await verify(user.hashPassword, password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const existUserWithEmail = await this.userService.findByEmail(email);

    if (existUserWithEmail) {
      throw new ConflictException('User with that email already registered');
    }

    const token = await this.confirmTokenService.createEmailConfirmToken(
      userId,
      email,
    );

    await this.mailService.sendEmailChangeConfirmation(email, token);

    return {
      message: 'Confirmation email has been sent.',
    };
  }

  async confirmEmailChange(dto: ConfirmEmailChangeDto) {
    const { token } = dto;
    const confirmToken = await this.confirmTokenService.verifyToken(
      token,
      'EMAIL_CHANGE',
    );
    const newEmail =
      this.confirmTokenService.getEmailChangePayload(confirmToken);

    const existUser = await this.userService.findByEmail(newEmail);

    if (existUser) {
      throw new ConflictException('User with that email already registered');
    }

    await this.userService.updateEmail(confirmToken.userId, newEmail);
    await this.confirmTokenService.markAsUsed(confirmToken.id);

    return true;
  }
}
