import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  ParseIntPipe,
  HttpException,
  UseGuards,
  Sse,
  Put,
  Query,
} from '@nestjs/common';
import { deleteUser } from 'supertokens-node';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { map, Observable, Subject } from 'rxjs';
import { RoleGuard } from '../authentication/role.guard';
import { Roles } from '../authentication/decorators/roles.decorator';
import { Session } from 'supertokens-nestjs';
import UserRoles from 'supertokens-node/recipe/userroles';

@ApiTags('Users')
@Controller('api/user')
export class UsersApiController {
  constructor(private readonly userService: UserService) {}

  private favAddons = new Subject<string>();

  @Get('/:userId')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({
    status: 200,
    description: 'Информация о пользователе успешно получена',
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiBearerAuth('access-token')
  async getUser(@Param('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @Post('/favourites/:songId')
  @ApiOperation({ summary: 'Добавить песню в избранное' })
  @ApiResponse({ status: 201, description: 'Песня добавлена в избранное' })
  @ApiResponse({
    status: 404,
    description: 'Песня или пользователь не найдены',
  })
  @ApiBearerAuth('access-token')
  async addFavourite(
    @Session('userId') userId: string,
    @Param('songId', ParseIntPipe) songId: number,
  ) {
    const res = await this.userService.addFavouriteSong(userId, songId);

    const message = `Песня ${res.song.title} успешно добавлена в избранное!`;
    this.favAddons.next(message);
    return res;
  }

  @Sse('sse/favourites')
  @ApiOperation({ summary: 'SSE поток обновлений избранного пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Успешное подключение к SSE потоку',
  })
  @ApiBearerAuth('access-token')
  streamFavourites(): Observable<{ data: string }> {
    return this.favAddons.pipe(map((message) => ({ data: message })));
  }

  @Get('me/favourites')
  @ApiOperation({ summary: 'Получить избранные песни пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список избранных песен пользователя',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Song Title' },
          artistId: { type: 'number', example: 10 },
          albumId: { type: 'number', example: 5 },
          listens: { type: 'number', example: 1000 },
          duration: { type: 'number', example: 200 },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  @ApiBearerAuth('access-token')
  async getFavourites(@Session('userId') userId: string) {
    try {
      return await this.userService.favouriteSongs(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Delete('/favourites/:songId')
  @ApiOperation({ summary: 'Удалить песню из избранного пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Песня удалена из избранного',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь или песня не найдены',
  })
  @ApiBearerAuth('access-token')
  async deleteFavourites(
    @Session('userId') userId: string,
    @Param('songId', ParseIntPipe) songId: number,
  ) {
    try {
      return this.userService.deleteFavouriteSong(userId, songId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Delete('/:userId')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно удален',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  async deleteUser(@Param('userId') userId: string) {
    try {
      await deleteUser(userId);
      return this.userService.delete(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Put('role/:userId')
  @ApiOperation({ summary: 'Добавить роль пользователю' })
  @ApiResponse({
    status: 200,
    description: 'Роль успешно добавлена пользователю',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(RoleGuard)
  @Roles('admin')
  async changeRole(
    @Param('userId') userId: string,
    @Query('role') role: string,
  ) {
    return UserRoles.addRoleToUser('public', userId, role);
  }

  @Delete('role/:userId')
  @ApiOperation({ summary: 'Удалить роль у пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Роль успешно удалена у пользователя',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(RoleGuard)
  @Roles('admin')
  async deleteRole(
    @Param('userId') userId: string,
    @Query('role') role: string,
  ) {
    return UserRoles.removeUserRole('public', userId, role);
  }
}
