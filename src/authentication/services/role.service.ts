import { Injectable, OnModuleInit } from '@nestjs/common';
import UserRoles from 'supertokens-node/recipe/userroles';

@Injectable()
export class RolesService implements OnModuleInit {
  async onModuleInit() {
    await this.ensureRolesExist();
  }

  private async ensureRolesExist() {
    await UserRoles.createNewRoleOrAddPermissions('user', ['read']);

    await UserRoles.createNewRoleOrAddPermissions('admin', [
      'read',
      'write',
      'delete',
    ]);

    await UserRoles.createNewRoleOrAddPermissions('writer', ['read', 'write']);
  }
}
