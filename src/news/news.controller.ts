import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Patch,
  HttpException,
  UseGuards,
  UseInterceptors,
  Header,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ETagInterceptor } from '../common/interceptors/etag.interceptor';
import { RoleGuard } from '../authentication/role.guard';
import { Roles } from '../authentication/decorators/roles.decorator';

@ApiTags('News')
@Controller('api/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новость' })
  @ApiBody({ type: CreateNewsDto })
  @ApiResponse({ status: 201, description: 'Новость успешно создана' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @UseGuards(RoleGuard)
  @Roles('admin', 'writer')
  @ApiBearerAuth('access-token')
  async createNews(@Body() createNewsDto: CreateNewsDto) {
    try {
      return this.newsService.create(createNewsDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @UseInterceptors(ETagInterceptor)
  @Header('Cache-Control', 'public, max-age=3600')
  @Get()
  @ApiOperation({ summary: 'Получить список новостей с пагинацией' })
  @ApiQuery({ name: 'cursor', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Список новостей' })
  @ApiBearerAuth('access-token')
  async getAllNews(
    @Query('cursor', ParseIntPipe) cursor: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    try {
      return this.newsService.findAll(cursor || 0, limit || 10);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получить одну новость по ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Новость найдена' })
  @ApiResponse({ status: 404, description: 'Новость не найдена' })
  @ApiBearerAuth('access-token')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.newsService.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Обновить новость по ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateNewsDto })
  @ApiResponse({ status: 200, description: 'Новость успешно обновлена' })
  @ApiResponse({ status: 404, description: 'Новость не найдена' })
  @UseGuards(RoleGuard)
  @Roles('admin', 'writer')
  @ApiBearerAuth('access-token')
  async updateNews(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    try {
      return this.newsService.update(id, updateNewsDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Удалить новость по ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Новость успешно удалена' })
  @ApiResponse({ status: 404, description: 'Новость не найдена' })
  @UseGuards(RoleGuard)
  @Roles('admin', 'writer')
  @ApiBearerAuth('access-token')
  async deleteNews(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.newsService.delete(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }
}
