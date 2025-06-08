import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumApiController } from './album-api.controller';
import { AllExceptionsFilter } from '../common/filters/exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { AlbumController } from './album.controller';
import { AlbumResolver } from './graphql/album.resolver';

@Module({
  controllers: [AlbumApiController, AlbumController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AlbumService,
    AlbumResolver,
  ],
  exports: [AlbumService],
})
export class AlbumModule {}
