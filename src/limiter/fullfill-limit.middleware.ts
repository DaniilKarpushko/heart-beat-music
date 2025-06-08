import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Session from 'supertokens-node/recipe/session';

@Injectable()
export class FullFillLimiterMiddleware implements NestMiddleware {
  async use(req: Request & { userId?: string }, res: Response, next: NextFunction) {
    try {
      const session = await Session.getSession(req, res);
      req.userId = session.getUserId();
    } catch {
      req.userId = undefined;
    }
    next();
  }
}
