import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../common/filters/exception.filter';
import { NewsResolver } from './graphql/news.resolver';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      store: 'memory',
      ttl: 10,
      max: 100,
    }),
  ],
  controllers: [NewsController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    NewsService,
    NewsResolver,
  ],
  exports: [NewsService],
})
export class NewsModule {}
