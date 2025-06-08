import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Session from 'supertokens-node/recipe/session';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await Session.getSession(req, res);

      const userId = session.getUserId();
      console.log(`User ${userId} is authenticated.`);
      next();
    } catch {
      res.redirect('/auth/login');
    }
  }
}
