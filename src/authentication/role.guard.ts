import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import UserRoles from 'supertokens-node/recipe/userroles';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<string>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRole) return true;

    const req = context
      .switchToHttp()
      .getRequest<Request & { session?: SessionContainer }>();

    if (!req.session) {
      throw new UnauthorizedException();
    }

    const userId = req.session.getUserId();

    const response = await UserRoles.getRolesForUser('public', userId);
    return response.roles.some((role) => requiredRole.includes(role));
  }
}
