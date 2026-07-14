import { BrevoClient } from '@getbrevo/brevo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly client: BrevoClient;
  private readonly senderEmail: string;
  private readonly senderName: string;
  private readonly apiUrl: string;
  private readonly clientAppUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new BrevoClient({
      apiKey: configService.getOrThrow<string>('BREVO_API'),
    });
    this.senderEmail = configService.getOrThrow<string>('BREVO_SENDER_EMAIL');
    this.senderName = configService.getOrThrow<string>('BREVO_SENDER_NAME');
    this.apiUrl = configService.getOrThrow<string>('API_URL');
    this.clientAppUrl = configService.getOrThrow<string>('CLIENT_APP_URL');
  }

  async sendEmailChangeConfirmation(email: string, token: string) {
    const confirmLink = `${this.clientAppUrl}/confirm-email-change?token=${token}`;

    await this.client.transactionalEmails.sendTransacEmail({
      htmlContent: `<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Brevo. <a href="${confirmLink}"> Click to confirm<a/></p></body></html>`,
      sender: {
        email: this.senderEmail,
        name: this.senderName,
      },
      subject: 'Confirm your email changing!',
      to: [
        {
          email,
        },
      ],
    });
  }

  async sendPasswordChangeConfirmation(email: string, token: string) {
    const confirmLink = `${this.clientAppUrl}/confirm-password-change?token=${token}`;
    await this.client.transactionalEmails.sendTransacEmail({
      htmlContent: `<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Brevo. <a href="${confirmLink}"> Click to confirm<a/> </br> <p>${token}</p></p></body></html>`,

      sender: {
        email: this.senderEmail,
        name: this.senderName,
      },
      subject: 'Confirm your password changing!',
      to: [
        {
          email,
        },
      ],
    });
  }

  async sendPasswordResetConfirmation(email: string, token: string) {
    const confirmLink = `${this.clientAppUrl}/confirm-password-reset?token=${token}`;
    await this.client.transactionalEmails.sendTransacEmail({
      htmlContent: `<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Brevo. <a href="${confirmLink}"> Click to confirm<a/> </br> <p>${token}</p></p></body></html>`,

      sender: {
        email: this.senderEmail,
        name: this.senderName,
      },
      subject: 'Confirm your password reset!',
      to: [
        {
          email,
        },
      ],
    });
  }
}
