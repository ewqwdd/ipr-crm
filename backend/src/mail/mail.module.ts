import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail',
      defaultJobOptions: {
        delay: 5000,
        attempts: 10,
        backoff: {
          type: 'fixed',
          delay: 5 * 60 * 1000, // 5 минут между попытками
        },
        removeOnComplete: 100, // 100 успешных задач для истории
        removeOnFail: 600, // 300 неудачных для анализа
      },
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
