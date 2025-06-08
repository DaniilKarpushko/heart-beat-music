import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { PublicAccess } from 'supertokens-nestjs';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';
import { AuthDto } from './dtos/auth.dto';
import Session, { SessionContainer } from 'supertokens-node/recipe/session';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get('login')
  @Render('pages/auth/login')
  @PublicAccess()
  getLogin() {
    return {
      title: 'HeartBeat Music',
      layout: 'auth-layout',
    };
  }

  @Post('login')
  @PublicAccess()
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body()
    body: AuthDto,
  ) {
    try {
      const email = body.email;
      const password = body.password;
      if (!email || !password) {
        return res.status(400).json({ status: 'INVALID_INPUT' });
      }

      const response = await EmailPassword.signIn('public', email, password);

      if (response.status === 'OK') {
        const userId = response.user.id;

        const rolesRes = await UserRoles.getRolesForUser('public', userId);
        const roles = rolesRes.status === 'OK' ? rolesRes.roles : [];

        await Session.createNewSession(
          req,
          res,
          'public',
          response.recipeUserId,
        );

        return res.status(200).json({
          status: 'OK',
          user: {
            id: userId,
            roles,
          },
        });
      } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
        return res.status(401).json({ status: 'WRONG_CREDENTIALS_ERROR' });
      }

      return res.status(500).json({ status: 'AUTH_ERROR' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: 'SERVER_ERROR' });
    }
  }

  @Post('registration')
  @PublicAccess()
  async register(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: AuthDto,
  ) {
    try {
      const response = await EmailPassword.signUp(
        'public',
        body.email,
        body.password,
      );

      if (response.status === 'OK') {
        const userId = response.user.id;
        await UserRoles.addRoleToUser('public', userId, 'user');

        const rolesRes = await UserRoles.getRolesForUser('public', userId);
        const roles = rolesRes.status === 'OK' ? rolesRes.roles : [];

        await Session.createNewSession(
          req,
          res,
          'public',
          response.recipeUserId,
        );

        return res.status(200).json({
          status: 'OK',
          user: {
            id: userId,
            roles,
          },
        });
      } else if (response.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
        return res.status(400).json({ error: 'Email уже зарегистрирован' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка регистрации' });
    }
  }

  @Get('registration')
  @Render('pages/auth/registration')
  @PublicAccess()
  getRegister() {
    return {
      title: 'HeartBeat Music',
      layout: 'auth-layout',
    };
  }

  @Post('logout')
  @PublicAccess()
  async signOut(@Req() req: Request, @Res() res: Response) {
    try {
      const session: SessionContainer = await Session.getSession(req, res);
      if (session) {
        await session.revokeSession();
      }
      return res.status(200).json({ message: 'Successfully logged out' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка выхода' });
    }
  }
}
