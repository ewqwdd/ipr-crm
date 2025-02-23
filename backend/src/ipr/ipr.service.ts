import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/db/prisma.service";

@Injectable()
export class IprService {
  constructor(private prismaService: PrismaService) {}

  async findOneby360Id(id: number) {
    return this.prismaService.individualGrowthPlan.findFirst({
      where: {
        id: id,
      },
    });
  }

}