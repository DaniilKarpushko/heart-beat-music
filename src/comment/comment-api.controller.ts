import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoleGuard } from '../authentication/role.guard';
import { Roles } from '../authentication/decorators/roles.decorator';
import { Session } from 'supertokens-nestjs';

@ApiTags('Comments')
@Controller('api/comments')
export class CommentApiController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/news/:newsId')
  @ApiOperation({ summary: 'Получить список комментариев к новостям' })
  @ApiParam({
    name: 'newsId',
    type: Number,
    description: 'ID новости, к которой нужно получить комментарии',
    example: 1,
  })
  @ApiQuery({
    name: 'cursor',
    type: Number,
    description: 'Индекс начала для пагинации',
    example: 0,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Количество комментариев на странице',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Список комментариев к новости',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          text: { type: 'string', example: 'Комментарий' },
          userId: { type: 'number', example: 123 },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Некорректные параметры запроса' })
  @ApiResponse({ status: 404, description: 'Новость не найдена' })
  @ApiBearerAuth('access-token')
  async get(
    @Param('newsId', ParseIntPipe) newsId: number,
    @Query('cursor', ParseIntPipe) cursor: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    try {
      return this.commentService.findAny(newsId, cursor, limit);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Post('/news/:newsId/users/:userId')
  @ApiOperation({ summary: 'Создать комментарий к новости' })
  @ApiParam({
    name: 'newsId',
    type: Number,
    description: 'ID новости, к которой нужно добавить комментарий',
    example: 1,
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'ID пользователя, который оставляет комментарий',
    example: 123,
  })
  @ApiBody({
    description: 'Текст комментария',
    type: String,
  })
  @ApiResponse({
    status: 201,
    description: 'Комментарий успешно добавлен',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        text: { type: 'string', example: 'Это новый комментарий' },
        userId: { type: 'number', example: 123 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Неверный формат текста комментария',
  })
  @ApiResponse({
    status: 404,
    description: 'Новость или пользователь не найдены',
  })
  async create(
    @Param('newsId', ParseIntPipe) newsId: number,
    @Session('userId') userId: string,
    @Body('text') text: string,
  ) {
    try {
      return this.commentService.create(newsId, userId, text);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Patch('/:id/:userId')
  @ApiOperation({ summary: 'Изменить комментарий' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID комментария, который нужно изменить',
    example: 1,
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'ID пользователя, который оставил комментарий',
    example: 123,
  })
  @ApiBody({
    description: 'Текст для обновления комментария',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Комментарий успешно обновлен',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        text: { type: 'string', example: 'Это обновленный комментарий' },
        userId: { type: 'number', example: 123 },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Некорректный текст комментария' })
  @ApiResponse({
    status: 404,
    description: 'Комментарий не найден или пользователь не совпадает',
  })
  @ApiBearerAuth('access-token')
  async changeComment(
    @Param('id', ParseIntPipe) id: number,
    @Session('userId') userId: string,
    @Body('text') text: string,
  ) {
    try {
      return this.commentService.changeComment(id, userId, text);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Delete('/:commentId')
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Удалить комментарий по ID' })
  @ApiParam({
    name: 'commentId',
    type: Number,
    description: 'ID комментария для удаления',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Комментарий успешно удален' })
  @ApiResponse({
    status: 403,
    description: 'Доступ запрещен. Требуется роль ADMIN.',
  })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  @ApiBearerAuth('access-token')
  async delete(@Param('commentId', ParseIntPipe) commentId: number) {
    try {
      return this.commentService.delete(commentId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }
}
