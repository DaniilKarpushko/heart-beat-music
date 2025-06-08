import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { LimitService } from './limiter.service';

@Injectable()
export class LimiterMiddleware implements NestMiddleware {
  private limiter;

  constructor(private readonly limitService: LimitService) {
    this.limiter = rateLimit({
      windowMs: 60 * 1000,
      max: async (req) => {
        const userId = (req as any).userId;
        return await this.limitService.isBlockedByUser(userId) ||
        await this.limitService.isBlockedByIp(req.ip)
          ? 10
          : 100;
      },
      keyGenerator: (req) => {
        const userId = (req as any).userId;
        return userId ?? req.ip ?? 'unknown';
      },
      message: 'Too many requests.',
      standardHeaders: true,
      legacyHeaders: false,
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    this.limiter(req, res, next);
  }
}

