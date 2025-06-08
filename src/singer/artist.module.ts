import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistApiController } from './artist-api.controller';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../common/filters/exception.filter';
import { ArtistResolver } from './graphql/artist.resolver';

@Module({
  controllers: [ArtistApiController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    ArtistService,
    ArtistResolver,
  ],
  exports: [ArtistService],
})
export class ArtistModule {}
