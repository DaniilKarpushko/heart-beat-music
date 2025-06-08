import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersApiController } from './user-api.controller';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../common/filters/exception.filter';
import { UserResolver } from './graphql/user.resolver';
import { UsersController } from './user.controller';

@Module({
  controllers: [UsersApiController, UsersController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    UserService,
    UserResolver,
  ],
  exports: [UserService],
})
export class UserModule {}
