import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  Render,
  UseInterceptors,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ETagInterceptor } from '../common/interceptors/etag.interceptor';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @UseInterceptors(ETagInterceptor)
  @Header('Cache-Control', 'public, max-age=3600')
  @Get()
  @Render('pages/collections/collections')
  @ApiOperation({ summary: 'Страница коллекций (SSR с пагинацией)' })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: Number,
    description: 'ID последнего элемента (для пагинации)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Максимальное количество записей',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'HTML-страница со списком коллекций',
  })
  @ApiBearerAuth('access-token')
  async getCollections(
    @Query('cursor') cursor: number = 0,
    @Query('limit') limit: number = 1,
  ) {
    const collections = await this.collectionService.findAll(cursor, limit);

    if (collections.length) {
      cursor = collections[collections.length - 1].id;
    }
    return {
      title: 'Collections',
      layout: 'layout',
      scripts: ['/scripts/collection.js'],
      collections,
      cursor,
    };
  }

  @Get('/:id')
  @Render('pages/collections/collection-detail')
  @ApiOperation({ summary: 'Детальная страница коллекции (SSR)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID коллекции',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'HTML-страница с данными коллекции',
  })
  @ApiResponse({ status: 404, description: 'Коллекция не найдена' })
  @ApiBearerAuth('access-token')
  async getCollectionById(@Param('id', ParseIntPipe) id: number) {
    const collection = await this.collectionService.findOne(id);

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    return {
      title: collection.name,
      collection,
      layout: 'layout',
    };
  }
}
