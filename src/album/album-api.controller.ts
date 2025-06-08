import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  Param,
  ValidationPipe,
  HttpException,
  UseInterceptors,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ETagInterceptor } from '../common/interceptors/etag.interceptor';
import { RoleGuard } from '../authentication/role.guard';
import { Roles } from '../authentication/decorators/roles.decorator';

@ApiTags('Albums')
@Controller('api/albums')
export class AlbumApiController {
  constructor(private readonly albumService: AlbumService) {}

  @UseInterceptors(ETagInterceptor)
  @Get('/top')
  @ApiOperation({ summary: 'Получить топ альбомов' })
  @ApiQuery({
    name: 'amount',
    type: Number,
    example: 5,
    description: 'Количество альбомов в топе',
  })
  @ApiResponse({
    status: 200,
    description: 'Список топ альбомов',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Top Album' },
          artistId: { type: 'number', example: 123 },
          type: { type: 'string', enum: ['SINGLE', 'ALBUM'], example: 'ALBUM' },
          length: { type: 'number', example: 50 },
          dropDate: { type: 'string', format: 'date', example: '2024-12-31' },
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  async findTop(@Query('amount', ParseIntPipe) amount: number) {
    try {
      return this.albumService.findTop(amount);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @UseInterceptors(ETagInterceptor)
  @Get('/latest')
  @ApiOperation({ summary: 'Получить последние альбомы' })
  @ApiResponse({
    status: 200,
    description: 'Список последних альбомов',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Latest Album' },
          artistId: { type: 'number', example: 123 },
          type: { type: 'string', enum: ['SINGLE', 'ALBUM'], example: 'ALBUM' },
          length: { type: 'number', example: 50 },
          dropDate: { type: 'string', format: 'date', example: '2024-04-01' },
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  async findLatest() {
    try {
      return this.albumService.findLatest();
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @UseInterceptors(ETagInterceptor)
  @Get()
  @ApiOperation({ summary: 'Получить все альбомы' })
  @ApiQuery({
    name: 'cursor',
    type: Number,
    example: 0,
    description: 'Индекс начальной позиции для пагинации',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    example: 10,
    description: 'Количество альбомов для возврата',
  })
  @ApiResponse({
    status: 200,
    description: 'Список альбомов',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Album Title' },
          artistId: { type: 'number', example: 123 },
          type: { type: 'string', enum: ['SINGLE', 'ALBUM'], example: 'ALBUM' },
          length: { type: 'number', example: 45 },
          dropDate: { type: 'string', format: 'date', example: '2024-03-15' },
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
      return this.albumService.findAll(cursor, limit);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Переименовать альбом' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID альбома' })
  @ApiBody({ schema: { example: { name: 'Новое название' } } })
  @ApiResponse({ status: 200, description: 'Альбом переименован' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  @ApiResponse({ status: 404, description: 'Альбом не найден' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  async changeAlbum(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
  ) {
    try {
      return this.albumService.renameAlbum(id, name);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый альбом' })
  @ApiBody({ type: CreateAlbumDto })
  @ApiResponse({
    status: 201,
    description: 'Альбом создан',
    schema: { $ref: '#/components/schemas/Album' },
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  async addAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    try {
      return this.albumService.create(createAlbumDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Удалить альбом' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID альбома' })
  @ApiResponse({ status: 200, description: 'Альбом удалён' })
  @ApiResponse({ status: 404, description: 'Альбом не найден' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  async deleteAlbum(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.albumService.deleteAlbum(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }
}
