import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Render,
  Res,
} from '@nestjs/common';
import { Session } from 'supertokens-nestjs';
import { UserService } from './user.service';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('new')
  @Render('pages/users/create-user')
  @ApiOperation({ summary: 'Форма создания нового пользователя (SSR)' })
  @ApiResponse({ status: 200, description: 'HTML-форма создания пользователя' })
  @ApiBearerAuth('access-token')
  getNew() {
    return {
      layout: 'auth-layout',
      title: 'HeartBeat Music',
    };
  }

  @Post('new')
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'new_user123' },
      },
      required: ['username'],
    },
  })
  @ApiResponse({
    status: 302,
    description: 'Переадресация на /menu после успешного создания',
  })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  @ApiBearerAuth('access-token')
  async postNew(
    @Body('username') username: string,
    @Session('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      await this.userService.create(username, userId);
      return res.redirect('/menu');
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }
}
