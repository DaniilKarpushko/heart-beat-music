import {
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Query,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../authentication/decorators/roles.decorator';
import { RoleGuard } from '../authentication/role.guard';

@Controller('files')
export class FilesController {
  constructor(private s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(RoleGuard)
  @Roles('admin', 'writer')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const uploadResult = await this.s3Service.uploadFile(file);
    return { url: uploadResult.Location };
  }

  @Delete()
  async removeFile(@Query('pictureUrl') path: string) {
    await this.s3Service.deleteFile(path);
  }
}
