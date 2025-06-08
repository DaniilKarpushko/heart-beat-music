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
import { SongService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
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

@ApiTags('Songs')
@Controller('api/songs')
export class SongApiController {
  constructor(private readonly songService: SongService) {}

  @UseInterceptors(ETagInterceptor)
  @Header('Cache-Control', 'public, max-age=3600')
  @Get()
  @ApiOperation({ summary: 'Получить все песни с пагинацией' })
  @ApiQuery({ name: 'cursor', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Список песен',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'My Song' },
          artistId: { type: 'number', example: 1 },
          albumId: { type: 'number', example: 1 },
          duration: { type: 'number', example: 210 },
          listens: { type: 'number', example: 1500 },
          path: { type: 'string', example: '/songs/mysong.mp3' },
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  async getAll(
    @Query('cursor', ParseIntPipe) cursor: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    try {
      return this.songService.findAll(cursor, limit);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @UseInterceptors(ETagInterceptor)
  @Get('/top')
  @ApiOperation({ summary: 'Получить топ песен по количеству прослушиваний' })
  @ApiQuery({ name: 'amount', required: true, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Список топ песен',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'My Song' },
          artistId: { type: 'number', example: 1 },
          albumId: { type: 'number', example: 1 },
          duration: { type: 'number', example: 210 },
          listens: { type: 'number', example: 1500 },
          path: { type: 'string', example: '/songs/mysong.mp3' },
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  async getTop(@Query('amount', ParseIntPipe) amount: number) {
    try {
      return this.songService.findTop(amount);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Get('/album/:albumId')
  @ApiOperation({ summary: 'Получить все песни альбома с пагинацией' })
  @ApiParam({ name: 'albumId', type: Number, description: 'ID альбома' })
  @ApiQuery({ name: 'cursor', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Список песен альбома',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'My Song' },
          artistId: { type: 'number', example: 1 },
          albumId: { type: 'number', example: 1 },
          duration: { type: 'number', example: 210 },
          listens: { type: 'number', example: 1500 },
          path: { type: 'string', example: '/songs/mysong.mp3' },
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  async getAlbumSongs(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Query('cursor', ParseIntPipe) cursor: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    try {
      return this.songService.findByAlbum(albumId, cursor, limit);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получить песню по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID песни' })
  @ApiResponse({
    status: 200,
    description: 'Информация о песне',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'My Song' },
        artistId: { type: 'number', example: 1 },
        albumId: { type: 'number', example: 1 },
        duration: { type: 'number', example: 210 },
        listens: { type: 'number', example: 1500 },
        path: { type: 'string', example: '/songs/mysong.mp3' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Песня не найдена' })
  @ApiBearerAuth('access-token')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.songService.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Post()
  @ApiOperation({ summary: 'Создать новую песню' })
  @ApiBody({ type: CreateSongDto })
  @ApiResponse({
    status: 201,
    description: 'Песня успешно создана',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'My Song' },
        artistId: { type: 'number', example: 1 },
        albumId: { type: 'number', example: 1 },
        duration: { type: 'number', example: 210 },
        listens: { type: 'number', example: 1500 },
        path: { type: 'string', example: '/songs/mysong.mp3' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Неверные данные для создания' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  async create(@Body() createSongDto: CreateSongDto) {
    try {
      return this.songService.create(createSongDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Обновить песню' })
  @ApiParam({ name: 'id', type: Number, description: 'ID песни' })
  @ApiBody({ type: UpdateSongDto })
  @ApiResponse({
    status: 200,
    description: 'Песня успешно обновлена',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'My Song' },
        artistId: { type: 'number', example: 1 },
        albumId: { type: 'number', example: 1 },
        duration: { type: 'number', example: 210 },
        listens: { type: 'number', example: 1500 },
        path: { type: 'string', example: '/songs/mysong.mp3' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Неверные данные для обновления' })
  @ApiResponse({ status: 404, description: 'Песня не найдена' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDto: UpdateSongDto,
  ) {
    try {
      return this.songService.update(id, updateSongDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.songService.remove(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Patch('/:id/listen')
  @ApiOperation({ summary: 'Увеличить количество прослушиваний на 1' })
  @ApiParam({ name: 'id', type: Number, description: 'ID песни' })
  @ApiResponse({
    status: 200,
    description: 'Песня с обновлённым полем listens',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        listens: { type: 'number', example: 1501 },
      },
    },
  })
  @ApiBearerAuth('access-token')
  async incrementListen(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.songService.incrementListens(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new HttpException('Internal server error', 500);
    }
  }
}
