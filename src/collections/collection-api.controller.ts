import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { ETagInterceptor } from '../common/interceptors/etag.interceptor';
import { Roles } from '../authentication/decorators/roles.decorator';
import { RoleGuard } from '../authentication/role.guard';

@ApiTags('Collections')
@Controller('api/collections')
export class CollectionApiController {
  constructor(private readonly collectionService: CollectionService) {}

  @UseInterceptors(ETagInterceptor)
  @Header('Cache-Control', 'public, max-age=3600')
  @Get()
  @ApiOperation({ summary: 'Получить список коллекций' })
  @ApiQuery({
    name: 'cursor',
    type: Number,
    description: 'Индекс начала для пагинации',
    example: 0,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Количество коллекций на странице',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Список коллекций',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'My Collection' },
          rating: { type: 'number', example: 4.5 },
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  async findAll(
    @Query('cursor', ParseIntPipe) cursor: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    try {
      return await this.collectionService.findAll(cursor, limit);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получить коллекцию по ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID коллекции',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Детали коллекции',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'My Collection' },
        rating: { type: 'number', example: 4.5 },
        songs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              songId: { type: 'number', example: 123 },
              title: { type: 'string', example: 'Song Title' },
            },
          },
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.collectionService.findOne(id);
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
  @Get('/:id/songs')
  @ApiOperation({ summary: 'Получить список песен коллекции' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID коллекции для получения песен',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Список песен коллекции',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          songId: { type: 'number', example: 123 },
          title: { type: 'string', example: 'Song Title' },
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  async getSongs(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.collectionService.getSongs(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Patch('/:id/songs')
  @ApiOperation({ summary: 'Добавить песню в коллекцию' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID коллекции',
    example: 1,
  })
  @ApiBody({
    description: 'ID песни для добавления в коллекцию',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Песня добавлена в коллекцию' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  async addSong(
    @Param('id', ParseIntPipe) id: number,
    @Body('songId', ParseIntPipe) songId: number,
  ) {
    try {
      return await this.collectionService.addSong(id, songId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Post()
  @ApiOperation({ summary: 'Создать новую коллекцию' })
  @ApiBody({
    description: 'Имя новой коллекции',
    type: CreateCollectionDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Коллекция создана',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'My New Collection' },
        rating: { type: 'number', example: 0.0 },
      },
    },
  })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  async create(@Body() createCollectionDto: CreateCollectionDto) {
    try {
      return await this.collectionService.create(createCollectionDto.name, 0); // По умолчанию рейтинг 0
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Удалить коллекцию по ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID коллекции для удаления',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Коллекция удалена' })
  @ApiResponse({ status: 404, description: 'Коллекция не найдена' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.collectionService.delete(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }
}
