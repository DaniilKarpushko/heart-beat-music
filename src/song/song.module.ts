import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongApiController } from './song-api.controller';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../common/filters/exception.filter';
import { SongResolver } from './graphql/song.resolver';

@Module({
  controllers: [SongApiController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    SongService,
    SongResolver,
  ],
  exports: [SongService],
})
export class SongModule {}
