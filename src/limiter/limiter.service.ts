import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class LimitService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private getIpKey(ip: string) {
    return `ip:${ip}`;
  }

  private getUserKey(userId: string) {
    return `user:${userId}`;
  }

  async blockIp(ip: string): Promise<void> {
    await this.cacheManager.set(this.getIpKey(ip), true);
  }

  async unblockIp(ip: string): Promise<void> {
    await this.cacheManager.del(this.getIpKey(ip));
  }

  async blockUser(userId: string): Promise<void> {
    await this.cacheManager.set(this.getUserKey(userId), true);
  }

  async unblockUser(userId: string): Promise<void> {
    await this.cacheManager.del(this.getUserKey(userId));
  }

  async isBlockedByIp(ip?: string): Promise<boolean> {
    if (!ip) return false;
    return !!(await this.cacheManager.get(this.getIpKey(ip)));
  }

  async isBlockedByUser(userId?: string): Promise<boolean> {
    if (!userId) return false;
    return !!(await this.cacheManager.get(this.getUserKey(userId)));
  }
}

