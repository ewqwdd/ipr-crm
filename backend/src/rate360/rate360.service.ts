import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';

@Injectable()
export class Rate360Service {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const rates = await this.prismaService.rate360.findMany({
      include: {
        tests: true,
        skills: true,
        specs: true,
        users: true,
      }
    });
    return rates;
  }



}
