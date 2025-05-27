import {
  ConflictException,
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

  // Product Folder Methods
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
      throw new ConflictException('Folder with this name already exists');
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
      throw new NotFoundException('Folder not found');
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
      throw new NotFoundException('Folder not found');
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
      throw new ConflictException('Folder with this name already exists');
    }

    return this.prismaService.profileConstructorFolderProduct.update({
      where: { id },
      data: { name },
    });
  }

  // Team Folder Methods
  async createTeamFolder({ name, productId }: CreateTeamFolderDto) {
    const product =
      await this.prismaService.profileConstructorFolderProduct.findUnique({
        where: { id: productId },
      });

    if (!product) {
      throw new NotFoundException('Product folder not found');
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
        'Team folder with this name already exists in this product',
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
      throw new NotFoundException('Team folder not found');
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
      throw new NotFoundException('Team folder not found');
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
        'Team folder with this name already exists in this product',
      );
    }

    return this.prismaService.profileConstructorFolderTeam.update({
      where: { id },
      data: { name },
    });
  }

  // Spec Folder Methods
  async createSpecFolder({ name, teamId }: CreateSpecFolderDto) {
    const team =
      await this.prismaService.profileConstructorFolderTeam.findUnique({
        where: { id: teamId },
      });

    if (!team) {
      throw new NotFoundException('Team folder not found');
    }

    const existingFolder =
      await this.prismaService.profileConstructorFolderSpec.findFirst({
        where: {
          name: {
            in: [name, name.toLowerCase(), name.toUpperCase()],
          },
          teamId,
        },
      });

    if (existingFolder) {
      throw new ConflictException(
        'Spec folder with this name already exists in this team',
      );
    }

    return this.prismaService.profileConstructorFolderSpec.create({
      data: {
        name,
        teamId,
      },
    });
  }

  async deleteSpecFolder(id: number) {
    const folder =
      await this.prismaService.profileConstructorFolderSpec.findUnique({
        where: { id },
      });

    if (!folder) {
      throw new NotFoundException('Spec folder not found');
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
      throw new NotFoundException('Spec folder not found');
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
        'Spec folder with this name already exists in this team',
      );
    }

    return this.prismaService.profileConstructorFolderSpec.update({
      where: { id },
      data: { name },
    });
  }
}
