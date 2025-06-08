import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LimiterController } from './limiter.controller';
import { LimiterMiddleware } from './limiter.middleware';
import { FullFillLimiterMiddleware } from './fullfill-limit.middleware';
import { LimitService } from './limiter.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 0,
    }),
  ],
  controllers: [LimiterController],
  providers: [LimitService],
  exports: [LimitService],
})
export class LimiterModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FullFillLimiterMiddleware, LimiterMiddleware).forRoutes('*');
  }
}
