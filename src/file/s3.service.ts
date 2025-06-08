import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      endpoint: 'https://storage.yandexcloud.net',
      accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
      secretAccessKey: this.configService.get<string>('S3_SECRET_KEY'),
      region: this.configService.get<string>('S3_REGION'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    if (!file || !file.buffer) {
      throw new Error('No file provided or file buffer is missing');
    }

    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME is not defined');
    }

    const uploadParams = {
      Bucket: bucketName,
      Key: `${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return this.s3.upload(uploadParams).promise();
  }

  async deleteFile(key: string): Promise<AWS.S3.DeleteObjectOutput> {
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME is not defined');
    }

    const deleteParams = {
      Bucket: bucketName,
      Key: key,
    };

    return this.s3.deleteObject(deleteParams).promise();
  }
}
