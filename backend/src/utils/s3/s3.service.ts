import { Injectable, OnModuleInit } from '@nestjs/common';
import { S3, config } from 'aws-sdk';

@Injectable()
export class S3Service implements OnModuleInit {
  private s3: AWS.S3;
  private bucketName: string;

  constructor() {
    this.s3 = new S3({
      apiVersion: '2006-03-01',
      signatureVersion: 'v4',
    });
    this.bucketName = process.env.AWS_BUCKET_NAME || '';
  }

  async onModuleInit() {
    config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async uploadImageBufferToS3(
    buffer: Buffer,
    fileName: string,
    folderName: string,
    mimeType?: string,
  ): Promise<string> {
    try {
      const params: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: `${folderName}/${fileName}`,
        Body: buffer,
        ContentType: mimeType ?? 'image/jpeg',
      };

      const data = await this.s3.upload(params).promise();
      return data.Location;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw new Error('Ошибка загрузки изображения в S3');
    }
  }

  async deleteImageFromS3(key: string): Promise<void> {
    try {
      const params: AWS.S3.DeleteObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3.deleteObject(params).promise();
      console.log('Файл успешно удален из S3:', key);
    } catch (error) {
      console.error('Ошибка при удалении файла из S3:', error);
      throw new Error('Ошибка удаления файла из S3');
    }
  }
}
