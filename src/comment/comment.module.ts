import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentApiController } from './comment-api.controller';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../common/filters/exception.filter';
import { CommentResolver } from './graphql/comment.resolver';

@Module({
  controllers: [CommentApiController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    CommentService,
    CommentResolver,
  ],
  exports: [CommentService],
})
export class CommentModule {}
