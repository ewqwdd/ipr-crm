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
      where: {
        archived: false,
      },
      include: {
        competencyBlocks: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
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

  async editSpec(id: number, name: string) {
    return await this.prismaService.spec.update({
      where: { id },
      data: {
        name,
      },
    });
  }

  async deleteSpec(id: number) {
    return await this.prismaService.spec.update({
      where: { id },
      data: {
        archived: true,
      },
    });
  }

  async editSpecActive(id: number, active: boolean) {
    return await this.prismaService.spec.update({
      where: { id },
      data: {
        active,
      },
    });
  }
}
