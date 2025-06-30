import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { CreateTeamFolderDto } from './dto/create-team-folder.dto';
import { CreateSpecFolderDto } from './dto/create-spec-folder.dto';
import { UpdateProductFolderDto } from './dto/update-product-folder.dto';
import { UpdateTeamFolderDto } from './dto/update-team-folder.dto';
import { UpdateSpecFolderDto } from './dto/update-spec-folder.dto';
import { CreateProductFolderDto } from './dto/create-product-folder.dto';
import { SetCompetencyBlocksForSpecFolderDto } from './dto/set-comeptency-blocks-for-spec-folder.dto';

@Injectable()
export class ProfileConstructorFolderService {
  constructor(private prismaService: PrismaService) {}

  async getProfileStructureFolders() {
    return this.prismaService.profileConstructorFolderProduct.findMany({
      include: {
        teams: {
          include: {
            specs: {
              include: {
                competencyBlocks: {
                  where: {
                    archived: false,
                  },
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async createProductFolder({ name }: CreateProductFolderDto) {
    const existingFolder =
      await this.prismaService.profileConstructorFolderProduct.findFirst({
        where: {
          name: {
            in: [name, name.toLowerCase(), name.toUpperCase()],
          },
        },
      });

    if (existingFolder) {
      throw new ConflictException('Папка с таким названием уже существует');
    }

    return this.prismaService.profileConstructorFolderProduct.create({
      data: {
        name,
      },
    });
  }

  async deleteProductFolder(id: number) {
    const folder =
      await this.prismaService.profileConstructorFolderProduct.findUnique({
        where: { id },
      });

    if (!folder) {
      throw new NotFoundException('Папка не найдена');
    }

    return this.prismaService.profileConstructorFolderProduct.delete({
      where: { id },
    });
  }

  async updateProductFolder(id: number, { name }: UpdateProductFolderDto) {
    const folder =
      await this.prismaService.profileConstructorFolderProduct.findUnique({
        where: { id },
      });

    if (!folder) {
      throw new NotFoundException('Папка не найдена');
    }

    const existingFolder =
      await this.prismaService.profileConstructorFolderProduct.findFirst({
        where: {
          name: {
            in: [name, name.toLowerCase(), name.toUpperCase()],
          },
          id: {
            not: id,
          },
        },
      });

    if (existingFolder) {
      throw new ConflictException('Папка с таким названием уже существует');
    }

    return this.prismaService.profileConstructorFolderProduct.update({
      where: { id },
      data: { name },
    });
  }

  async createTeamFolder({ name, productId }: CreateTeamFolderDto) {
    const product =
      await this.prismaService.profileConstructorFolderProduct.findUnique({
        where: { id: productId },
      });

    if (!product) {
      throw new NotFoundException('Папка продукта не найдена');
    }

    const existingFolder =
      await this.prismaService.profileConstructorFolderTeam.findFirst({
        where: {
          name: {
            in: [name, name.toLowerCase(), name.toUpperCase()],
          },
          productId,
        },
      });

    if (existingFolder) {
      throw new ConflictException(
        'Папка команды с таким названием уже существует в этом продукте',
      );
    }

    return this.prismaService.profileConstructorFolderTeam.create({
      data: {
        name,
        productId,
      },
    });
  }

  async deleteTeamFolder(id: number) {
    const folder =
      await this.prismaService.profileConstructorFolderTeam.findUnique({
        where: { id },
      });

    if (!folder) {
      throw new NotFoundException('Папка команды не найдена');
    }

    return this.prismaService.profileConstructorFolderTeam.delete({
      where: { id },
    });
  }

  async updateTeamFolder(id: number, { name }: UpdateTeamFolderDto) {
    const folder =
      await this.prismaService.profileConstructorFolderTeam.findUnique({
        where: { id },
      });

    if (!folder) {
      throw new NotFoundException('Папка команды не найдена');
    }

    const existingFolder =
      await this.prismaService.profileConstructorFolderTeam.findFirst({
        where: {
          name: {
            in: [name, name.toLowerCase(), name.toUpperCase()],
          },
          productId: folder.productId,
          id: {
            not: id,
          },
        },
      });

    if (existingFolder) {
      throw new ConflictException(
        'Папка команды с таким названием уже существует в этом продукте',
      );
    }

    return this.prismaService.profileConstructorFolderTeam.update({
      where: { id },
      data: { name },
    });
  }

  async createSpecFolder({ specs, teamId }: CreateSpecFolderDto) {
    const team =
      await this.prismaService.profileConstructorFolderTeam.findUnique({
        where: { id: teamId },
      });

    if (!team) {
      throw new NotFoundException('Папка команды не найдена');
    }

    const existingFolder =
      await this.prismaService.profileConstructorFolderSpec.findFirst({
        where: {
          name: {
            in: specs,
          },
          teamId,
        },
      });

    if (existingFolder) {
      throw new ConflictException(
        'Папка спеціалізации с таким названием уже существует в этой команде',
      );
    }

    return this.prismaService.profileConstructorFolderSpec.createMany({
      data: specs.map((name) => ({
        name,
        teamId,
      })),
    });
  }

  async deleteSpecFolder(id: number) {
    const folder =
      await this.prismaService.profileConstructorFolderSpec.findUnique({
        where: { id },
      });

    if (!folder) {
      throw new NotFoundException('Папка спеціалізації не найдена');
    }

    return this.prismaService.profileConstructorFolderSpec.delete({
      where: { id },
    });
  }

  async updateSpecFolder(id: number, { name }: UpdateSpecFolderDto) {
    const folder =
      await this.prismaService.profileConstructorFolderSpec.findUnique({
        where: { id },
      });

    if (!folder) {
      throw new NotFoundException('Папка спеціалізації не найдена');
    }

    const existingFolder =
      await this.prismaService.profileConstructorFolderSpec.findFirst({
        where: {
          name: {
            in: [name, name.toLowerCase(), name.toUpperCase()],
          },
          teamId: folder.teamId,
          id: {
            not: id,
          },
        },
      });

    if (existingFolder) {
      throw new ConflictException(
        'Папка спеціалізации с таким названием уже существует в этой команде',
      );
    }

    return this.prismaService.profileConstructorFolderSpec.update({
      where: { id },
      data: { name },
    });
  }

  async setCompetencyBlocksForSpecFolder(
    specFolderId: number,
    { competencyBlockIds }: SetCompetencyBlocksForSpecFolderDto,
  ) {
    const specFolder =
      await this.prismaService.profileConstructorFolderSpec.findUnique({
        where: { id: specFolderId },
      });

    if (!specFolder) {
      throw new NotFoundException('Папка спецификации не найдена');
    }

    const competencyBlocks = await this.prismaService.competencyBlock.findMany({
      where: {
        id: {
          in: competencyBlockIds,
        },
        archived: false,
      },
    });

    if (competencyBlocks.length !== competencyBlockIds.length) {
      throw new BadRequestException('Некоторые блоки компетенций не найдены');
    }

    await this.prismaService.profileConstructorFolderSpec.update({
      where: { id: specFolderId },
      data: {
        competencyBlocks: {
          set: competencyBlockIds.map((id) => ({ id })),
        },
      },
    });

    return this.prismaService.profileConstructorFolderSpec.findUnique({
      where: { id: specFolderId },
      include: {
        competencyBlocks: true,
      },
    });
  }

  async removeCompetencyBlockFromSpecFolder(
    specFolderId: number,
    competencyBlockId: number,
  ) {
    const specFolder =
      await this.prismaService.profileConstructorFolderSpec.findUnique({
        where: { id: specFolderId },
      });

    if (!specFolder) {
      throw new NotFoundException('Папка спецификации не найдена');
    }

    await this.prismaService.profileConstructorFolderSpec.update({
      where: { id: specFolderId },
      data: {
        competencyBlocks: {
          disconnect: { id: competencyBlockId },
        },
      },
    });

    return HttpStatus.OK;
  }
}
