import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { RoleGuard } from './authentication/role.guard';
import { Roles } from './authentication/decorators/roles.decorator';

@ApiTags('Pages')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/admin')
  @Render('pages/admin')
  @ApiOperation({ summary: 'Доступ к админской панели' })
  @ApiResponse({
    status: 200,
    description: 'Рендерит страницу админской панели.',
    schema: {
      type: 'object',
      properties: {
        layout: { type: 'string', example: 'admin-layout' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Доступ запрещен, пользователь не является администратором.',
  })
  @UseGuards(RoleGuard)
  @Roles('admin')
  getAdmin() {
    return {
      layout: 'admin-layout',
    };
  }

  @Get('/menu')
  @Render('pages/menu')
  @ApiOperation({ summary: 'Главное меню' })
  @ApiResponse({
    status: 200,
    description: 'Рендерит главное меню страницы.',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'HeartBeat Music' },
        sponsors: {
          type: 'array',
          items: { type: 'string' },
          example: ['dudeinblack', 'woopty123', 'GhostFaceKillah'],
        },
        layout: { type: 'string', example: 'layout' },
        scripts: {
          type: 'array',
          items: { type: 'string' },
          example: ['/scripts/news.js', '/scripts/song.js'],
        },
      },
    },
  })
  getMainMenu() {
    return {
      title: 'HeartBeat Music',
      sponsors: ['dudeinblack', 'woopty123', 'GhostFaceKillah'],
      layout: 'layout',
      scripts: ['/scripts/news.js', '/scripts/song.js'],
    };
  }

  @Get('/top')
  @Render('pages/top')
  @ApiOperation({ summary: 'Страница топа' })
  @ApiResponse({
    status: 200,
    description: 'Рендерит страницу с топом.',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'TOP' },
        layout: { type: 'string', example: 'layout' },
        scripts: {
          type: 'array',
          items: { type: 'string' },
          example: ['/scripts/top-table.js'],
        },
      },
    },
  })
  getMainTop() {
    return {
      title: 'TOP',
      layout: 'layout',
      scripts: ['/scripts/top-table.js'],
    };
  }

  @Get('/favourites')
  @Render('pages/favourite-songs')
  @ApiOperation({ summary: 'Страница избранных песен' })
  @ApiResponse({
    status: 200,
    description: 'Рендерит страницу избранных песен пользователя.',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Favourite Songs' },
        layout: { type: 'string', example: 'layout' },
        scripts: {
          type: 'array',
          items: { type: 'string' },
          example: ['/scripts/favorite-songs.js'],
        },
      },
    },
  })
  getFavourites() {
    return {
      title: 'Favourite Songs',
      layout: 'layout',
      scripts: ['/scripts/favorite-songs.js'],
    };
  }
}
