import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueError,
  OnGlobalQueueError,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MailService } from './mail.service';
import { MailJobData } from './mail.types';
import { errorLogger } from 'src/utils/filters/logger';

@Processor('mail')
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailService: MailService) {}

  @Process('send-email')
  async handleSendEmail(job: Job<MailJobData>) {
    const { to, subject } = job.data;

    this.logger.log(`Sending email to ${to} (attempt ${job.attemptsMade + 1})`);

    try {
      await this.mailService.sendMailDirect(job.data);
      this.logger.log(`Email successfully sent to ${to}`);
      return { success: true, to, subject };
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }

  @OnQueueActive()
  onActive(job: Job<MailJobData>) {
    this.logger.log(`Processing job ${job.id} for ${job.data.to}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job<MailJobData>, result: any) {
    this.logger.log(`Job ${job.id} completed successfully for ${job.data.to}`);
  }

  @OnQueueFailed()
  onFailed(job: Job<MailJobData>, error: Error) {
    this.logger.error(
      `Job ${job.id} failed for ${job.data.to} (attempt ${job.attemptsMade}): ${error.message}`,
    );
  }

  @OnQueueError()
  OnQueueError(error: Error) {
    this.logger.log('Bull queue error:', error);
  }

  @OnGlobalQueueError()
  OnGlobalQueueError(error: Error) {
    this.logger.log('Bull queue error:', error);
  }
}
