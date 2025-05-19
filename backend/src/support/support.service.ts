import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { NotificationsService } from 'src/utils/notifications/notifications.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { Prisma } from '@prisma/client';
import { GetSupportTicketsDto } from './dto/get-support-tickets.dto';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';

@Injectable()
export class SupportService {
  constructor(
    private prismaService: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async createSupportTicket(userId: number, data: CreateSupportTicketDto) {
    const createdTicket = await this.prismaService.supportTicket.create({
      data: {
        ...data,
        userId,
      },
    });

    const admins = await this.prismaService.user.findMany({
      where: {
        role: {
          name: 'admin',
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    await Promise.all(
      admins.map((admin) =>
        this.notificationsService.sendSupportTicketCreatedNotification(
          createdTicket.id,
          admin,
        ),
      ),
    );
    return createdTicket;
  }

  async getUserSupportTickets(userId: number) {
    return this.prismaService.supportTicket.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getSupportTickets({ limit, page, status }: GetSupportTicketsDto) {
    const [data, total] = await Promise.all([
      this.prismaService.supportTicket.findMany({
        where: { status },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          curator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.supportTicket.count({
        where: { status },
      }),
    ]);

    return {
      data,
      total,
    };
  }

  async updateSupportTicket(id: number, data: Prisma.SupportTicketUpdateInput) {
    return this.prismaService.supportTicket.update({
      where: {
        id: id,
      },
      data,
    });
  }

  async assignSelfToSupportTicket(ticketId: number, userId: number) {
    const ticket = await this.prismaService.supportTicket.findUnique({
      where: {
        id: ticketId,
      },
      select: {
        curatorId: true,
      },
    });

    if (ticket?.curatorId) {
      throw new Error('Ticket already has a curator');
    }

    return this.prismaService.supportTicket.update({
      where: {
        id: ticketId,
      },
      data: {
        curatorId: userId,
      },
    });
  }

  async getSupportTicket(ticketId: number, sessionInfo: GetSessionInfoDto) {
    const ticket = await this.prismaService.supportTicket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        curator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    if (ticket.userId !== sessionInfo.id && sessionInfo.role !== 'admin') {
      throw new Error('You do not have permission to view this ticket');
    }

    return ticket;
  }
}
