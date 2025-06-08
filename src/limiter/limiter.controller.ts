import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LimitService } from './limiter.service';

@Controller('api-limit')
export class LimiterController {
  constructor(private readonly limitService: LimitService) {}

  @Post('block/ip/:ip')
  blockIp(@Param('ip') ip: string) {
    this.limitService.blockIp(ip);
    return { status: 'blocked', ip };
  }

  @Delete('block/ip/:ip')
  unblockIp(@Param('ip') ip: string) {
    this.limitService.unblockIp(ip);
    return { status: 'unblocked', ip };
  }

  @Post('block/user/:userId')
  blockUser(@Param('userId') userId: string) {
    this.limitService.blockUser(userId);
    return { status: 'blocked', userId };
  }

  @Delete('block/user/:userId')
  unblockUser(@Param('userId') userId: string) {
    this.limitService.unblockUser(userId);
    return { status: 'unblocked', userId };
  }
}
