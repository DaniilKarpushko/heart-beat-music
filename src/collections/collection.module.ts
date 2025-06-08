import { Module } from '@nestjs/common';
import { CollectionApiController } from './collection-api.controller';
import { CollectionService } from './collection.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../common/filters/exception.filter';
import { CollectionController } from './collection.controller';
import { CollectionResolver } from './graphql/collection.resolver';

@Module({
  controllers: [CollectionApiController, CollectionController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    CollectionService,
    CollectionResolver,
  ],
  exports: [CollectionService],
})
export class CollectionModule {}
