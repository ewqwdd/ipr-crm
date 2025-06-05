import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, normalize } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly uploadRoot = join(process.cwd(), '..', 'uploads');

  constructor() {
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
    subfolder?: string, // например, 'avatars' или 'docs/2024'
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
      // Путь для отдачи статики
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
}
