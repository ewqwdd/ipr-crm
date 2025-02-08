import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';

@Injectable()
export class UniversalService {
  constructor(private prismaService: PrismaService) {}

  async findRoles() {
    const roles = await this.prismaService.role.findMany();
    return roles;
  }

  async findSpecs() {
    const spec = await this.prismaService.spec.findMany({
      include: {
        competencyBlocks: {
          select: {
            id: true
          }
        }
      }
    });
    return spec;
  }

  async createSpec(name: string) {
    const role = await this.prismaService.spec.create({
      data: {
        name,
      },
    });
    return role;
  }
}
