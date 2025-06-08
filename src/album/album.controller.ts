import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  Render,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @Render('pages/albums/albums')
  @ApiBearerAuth('access-token')
  async getAllAlbums(
    @Query('cursor', ParseIntPipe) cursor: number = 0,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    const albums = await this.albumService.findAll(cursor, limit); // Получаем все альбомы
    return {
      title: 'All Albums',
      albums,
      layout: 'layout',
    };
  }

  @Get('/:id')
  @Render('pages/albums/album-detail')
  @ApiBearerAuth('access-token')
  async getAlbumById(@Param('id', ParseIntPipe) id: number) {
    const album = await this.albumService.findOne(id); // Приводим id к числу

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return {
      title: album.title,
      album,
      layout: 'layout',
    };
  }
}
