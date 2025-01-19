import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';

@Injectable()
export class UniversalService {
  constructor(private prismaService: PrismaService) {}

  async findRoles() {
    const roles = await this.prismaService.role.findMany();
    return roles;
  }
}
