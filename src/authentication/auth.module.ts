import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { RolesService } from './services/role.service';
import { SuperTokensModule } from 'supertokens-nestjs';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';
import { AuthController } from './auth.controller';
import Dashboard from 'supertokens-node/recipe/dashboard';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({})
export class AuthModule implements NestModule {
  static register(): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        SuperTokensModule.forRoot({
          framework: 'express',
          supertokens: {
            connectionURI:
              process.env.SUPERTOKENS_CONNECTION_URI || 'http://localhost:3567',
            apiKey: process.env.SUPERTOKENS_API_KEY,
          },
          appInfo: {
            appName: 'MyApp',
            apiDomain: 'http://localhost:3001',
            websiteDomain: 'http://localhost:3001',
            apiBasePath: '/auth',
            websiteBasePath: '/auth',
          },
          recipeList: [
            Session.init({
              cookieSameSite: 'lax',
              cookieSecure: false,
              getTokenTransferMethod: () => 'cookie',
            }),
            UserRoles.init(),
            Dashboard.init(),
            EmailPassword.init(),
          ],
        }),
      ],
      controllers: [AuthController],
      providers: [RolesService],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        '/auth/login',
        '/auth/registration',
        '/auth/logout',
        '/api/user/answer',
        '/graphql',
      )
      .forRoutes('*');
  }
}
