import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_EMAIL_PASSWORD,
    },
  });

  async sendMail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: process.env.GOOGLE_EMAIL,
      to,
      subject,
      html,
    });
  }

  async sendInviteEmail(to: string, user: User) {
    const html = `
    <div style="font-family: 'Nunito Sans', sans-serif; padding: 24px; text-align: center; color: #374151; background-color: #f9fafb; border-radius: 8px;">

    <h2 style="font-size: 24px; font-weight: 800; line-height: 1.25; margin-bottom: 16px; color: #111827;">Регистрация на платформе AYA SKILLS</h2>

    <div style="max-width: 600px; margin: 0 auto; padding: 24px; background-color: #fff; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);">

        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 16px;">Здравствуйте, ${user.firstName ?? user.username ?? user.username ?? user.email}!</p>

        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 16px;">Для того чтобы зарегистрироваться на платформе AYA SKILLS, пожалуйста, воспользуйтесь следующими данными:</p>

        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
            <strong style="font-weight: 600;">Логин:</strong> ${user.email}
        </p>

        <a href="${process.env.FRONTEND_URL}/invite?code=${user.authCode}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; transition: background-color 0.2s ease-in-out;">Задать пароль</a>

        <p style="font-size: 16px; line-height: 1.5; margin-top: 24px;">Если возникнут вопросы, пожалуйста, свяжитесь с HR в Telegram: <a href="https://t.me/cherry_aya" style="color: #2563eb; text-decoration: none;">@cherry_aya</a></p>

    </div>

    <p style="font-size: 14px; line-height: 1.5; margin-top: 24px; color: #6b7280;">С уважением,<br>Команда AYA Group</p>

</div>
        `;
    await this.sendMail(
      to,
      'Приглашение к регистрации на платформе AYA SKILLS',
      html,
    );
  }

  async sendResetPasswordEmail(to: string, user: User) {
    const html = `
        <div style="font-family:Arial,sans-serif;padding:20px;text-align: center;">
      <h2 style="max-width:560px;margin:30px auto;">Здраствуйте, ${user.firstName ?? ''} ${user.lastName ?? ''}.</h2>
        <p style="max-width:560px;margin:30px auto;">Вы запросили смену пароля</p>
<p style="margin-left:30px;">Чтобы задать пароль, нажмите на кнопку "Задать пароль"</p>
      <a href="${process.env.FRONTEND_URL}/reset-password?code=${user.authCode}" style="display:inline-block;margin-top:20px;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Задать пароль</a>
      </div>
        `;
    await this.sendMail(to, 'Смена пароля', html);
  }
}
