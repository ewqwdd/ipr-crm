import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { promises as fs } from 'fs';
import { join, normalize } from 'path';
import { PrismaService } from 'src/utils/db/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly uploadRoot = join(process.cwd(), '..', 'uploads');

  constructor(private prismaService: PrismaService) {
    this.ensureDirectory(this.uploadRoot);
  }

  private async ensureDirectory(path: string) {
    try {
      await fs.access(path);
    } catch {
      await fs.mkdir(path, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    subfolder?: string,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }

    const [name, fileExtension] = file.originalname.split('.');
    const filename = `${uuidv4()}-${name}.${fileExtension}`;
    const safeSubfolder = subfolder
      ? normalize(subfolder).replace(/^(\.\.[\/\\])+/, '')
      : '';
    const targetDir = safeSubfolder
      ? join(this.uploadRoot, safeSubfolder)
      : this.uploadRoot;

    await this.ensureDirectory(targetDir);

    const filePath = join(targetDir, filename);

    try {
      await fs.writeFile(filePath, file.buffer);
      const staticPath = safeSubfolder
        ? `/uploads/${safeSubfolder}/${filename}`
        : `/uploads/${filename}`;
      return staticPath;
    } catch (error) {
      throw new BadRequestException('Ошибка при сохранении файла');
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    const absolutePath = join(process.cwd(), '..', filePath);
    console.log('Deleting file:', absolutePath);

    try {
      await fs.access(absolutePath);
      await fs.unlink(absolutePath);
    } catch {
      throw new NotFoundException('Файл не найден');
    }
  }

  getFilePath(filename: string, subfolder?: string): string {
    const safeSubfolder = subfolder
      ? normalize(subfolder).replace(/^(\.\.[\/\\])+/, '')
      : '';
    return safeSubfolder
      ? `/uploads/${safeSubfolder}/${filename}`
      : `/uploads/${filename}`;
  }

  //   @Cron('0 0 * * 0')
  @Cron(CronExpression.EVERY_WEEKEND)
  async cleanUpUnusedFiles() {
    try {
      console.log('Starting cleanup of unused files...');

      const testQuestionFiles = await this.prismaService.question.findMany({
        where: {
          photoUrl: {
            not: null,
          },
        },
        select: {
          photoUrl: true,
        },
      });

      const surveyQuestionFiles =
        await this.prismaService.surveyQuestion.findMany({
          where: {
            photoUrl: {
              not: null,
            },
          },
          select: {
            photoUrl: true,
          },
        });

      const allUsedFiles = new Set([
        ...testQuestionFiles.map((q) => q.photoUrl),
        ...surveyQuestionFiles.map((q) => q.photoUrl),
      ]);

      const files = await fs.readdir(this.uploadRoot);
      const unusedFiles = files.filter((file) => {
        return !allUsedFiles.has(file) && file.includes('.');
      });

      console.log(`Found ${unusedFiles.length} unused files.`);

      for (const file of unusedFiles) {
        await this.deleteFile(this.getFilePath(file));
      }
    } catch (error) {
      console.error('Error during file cleanup:', error);
      throw new BadRequestException('Ошибка при очистке файлов');
    }
  }
}
