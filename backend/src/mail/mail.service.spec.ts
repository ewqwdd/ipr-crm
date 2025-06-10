import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('MailService', () => {
  let service: MailService;
  let queue: Queue;
  const mockQueue = { add: jest.fn(), addBulk: jest.fn() };
  const mockTransporter = { sendMail: jest.fn() };

  beforeEach(async () => {
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: getQueueToken('mail'), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    queue = module.get<Queue>(getQueueToken('mail'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add job to queue on sendMail', async () => {
    await service.sendMail('to@mail.com', 'subject', '<p>html</p>');
    expect(mockQueue.add).toHaveBeenCalledWith(
      'send-email',
      expect.objectContaining({
        to: 'to@mail.com',
        subject: 'subject',
        html: '<p>html</p>',
        from: process.env.GOOGLE_EMAIL,
      }),
    );
  });

  it('should call transporter.sendMail on sendMailDirect', async () => {
    await service.sendMailDirect({
      to: 'to@mail.com',
      subject: 'subject',
      html: '<p>html</p>',
      from: 'from@mail.com',
    });
    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'from@mail.com',
      to: 'to@mail.com',
      subject: 'subject',
      html: '<p>html</p>',
    });
  });
});
