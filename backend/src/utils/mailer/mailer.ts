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
        div style="font-family:Arial,sans-serif;padding:20px;text-align: center;">
      <h2 style="max-width:560px;margin:30px auto;">Здраствуйте, ${user.firstName} ${user.lastName}.</h2>
        <p style="max-width:560px;margin:30px auto;">Вы стали сотрудником компании AYA Group</p>
        <h2 style="margin-left:30px;">Данные для входа:</h2>
<p style="margin-left:30px;"><b>логин</b>: <a href="mailto:${user.email}">${user.email}</a></p>
<p style="margin-left:30px;">Чтобы задать пароль, нажмите на кнопку "Задать пароль"</p>
      <a href="${process.env.FRONTEND_URL}/invite?code=${user.authCode}" style="display:inline-block;margin-top:20px;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;margin-left:30px;">Задать пароль</a>
      </div>
        `;
    await this.sendMail(to, 'Приглашение в AYA Group', html);
  }

  async sendResetPasswordEmail(to: string, user: User) {
    const html = `
        <div style="font-family:Arial,sans-serif;padding:20px;text-align: center;">
      <h2 style="max-width:560px;margin:30px auto;">Здраствуйте, ${user.firstName} ${user.lastName}.</h2>
        <p style="max-width:560px;margin:30px auto;">Вы запросили смену пароля</p>
<p style="margin-left:30px;">Чтобы задать пароль, нажмите на кнопку "Задать пароль"</p>
      <a href="${process.env.FRONTEND_URL}/reset-password?code=${user.authCode}" style="display:inline-block;margin-top:20px;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;margin-left:30px;">Задать пароль</a>
      </div>
        `;
    await this.sendMail(to, 'Смена пароля', html);
  }
}
