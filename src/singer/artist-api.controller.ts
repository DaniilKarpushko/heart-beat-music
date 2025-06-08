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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
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

@ApiTags('Artists')
@Controller('api/artists')
export class ArtistApiController {
  constructor(private readonly artistService: ArtistService) {}

  @UseInterceptors(ETagInterceptor)
  @Header('Cache-Control', 'public, max-age=3600')
  @Get('/top')
  @ApiOperation({ summary: 'Получить топ артистов по рейтингу' })
  @ApiQuery({ name: 'amount', required: true, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Список топ артистов',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'John' },
          surname: { type: 'string', example: 'Doe' },
          nickname: { type: 'string', example: 'Johny' },
          rating: { type: 'number', example: 4.5 },
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  async getTop(@Query('amount', ParseIntPipe) amount: number) {
    try {
      return this.artistService.getTop(amount);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получить артиста по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID артиста' })
  @ApiResponse({
    status: 200,
    description: 'Информация об артисте',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'John' },
        surname: { type: 'string', example: 'Doe' },
        nickname: { type: 'string', example: 'Johny' },
        rating: { type: 'number', example: 4.5 },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Артист не найден' })
  @ApiBearerAuth('access-token')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.artistService.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @UseInterceptors(ETagInterceptor)
  @Get('')
  @ApiOperation({ summary: 'Получить всех артистов с пагинацией' })
  @ApiQuery({ name: 'cursor', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Список артистов',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'John' },
          surname: { type: 'string', example: 'Doe' },
          nickname: { type: 'string', example: 'Johny' },
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
      return this.artistService.getAll(cursor, limit);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Post()
  @ApiOperation({ summary: 'Создать нового артиста' })
  @ApiBody({ type: CreateArtistDto })
  @ApiResponse({
    status: 201,
    description: 'Артист успешно создан',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'John' },
        surname: { type: 'string', example: 'Doe' },
        nickname: { type: 'string', example: 'Johny' },
        rating: { type: 'number', example: 4.5 },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Неверные данные для создания' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  async create(@Body() createArtistDto: CreateArtistDto) {
    try {
      return this.artistService.create(createArtistDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Удалить артиста по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID артиста' })
  @ApiResponse({ status: 200, description: 'Артист успешно удален' })
  @ApiResponse({ status: 404, description: 'Артист не найден' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.artistService.delete(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Обновить данные артиста' })
  @ApiParam({ name: 'id', type: Number, description: 'ID артиста' })
  @ApiBody({ type: UpdateArtistDto })
  @ApiResponse({
    status: 200,
    description: 'Данные артиста успешно обновлены',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'John' },
        surname: { type: 'string', example: 'Doe' },
        nickname: { type: 'string', example: 'Johny' },
        rating: { type: 'number', example: 4.5 },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Неверные данные для обновления' })
  @ApiResponse({ status: 404, description: 'Артист не найден' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    try {
      return this.artistService.update(id, updateArtistDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }
}
