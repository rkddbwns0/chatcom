import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTokenEntity } from '../entities/user_token.entity';
import { Not, Repository } from 'typeorm';
import { Response, response } from 'express';
import { IS_PUBLIC_KEY } from './decorator/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard
  extends AuthGuard('jwt-service')
  implements CanActivate
{
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,

    @InjectRepository(UserTokenEntity)
    private readonly userToken: Repository<UserTokenEntity>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const logger = new Logger('JwtAuthGuard');

    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const accessToken = request.cookies['user_access_token'];
    const refreshToken = request.cookies['user_refresh_token'];

    const access_payload = await this.checkAccessToken(
      accessToken,
      refreshToken,
    );
    if (access_payload?.newAccessToken) {
      response.clearCookie('user_access_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });
      response.cookies('user_access_token', access_payload.newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });
    }

    await this.checkRefreshToken(
      access_payload?.payload?.user_id,
      refreshToken,
      response,
    );

    if (!accessToken || !refreshToken) {
      this.clearAuthCookies(response);
      return response.redirect('/');
    }


    if (!(access_payload && access_payload?.payload.user_id)) {
      this.clearAuthCookies(response);                 
      response.redirect('/');
    }
    request.user = access_payload;

    try {
      const today = new Date();
      const store_token = await this.userToken.findOne({
        where: {
          user_id: request.user_id,
          token: refreshToken,
        },
      });
      if (!store_token) {
        await this.userToken.delete({
          user_id: request.user_id,
          token: Not(refreshToken),
        });
        this.clearAuthCookies(response);
        return response.redirect('/');
      }
      if (store_token.expires_in < today) {
        await this.userToken.remove(store_token);
        this.clearAuthCookies(response);
        return response.redirect('/');
      }
    } catch (error) {
      logger.error(error.stack);
      this.clearAuthCookies(response);
      return response.redirect('/');
    }

    return true;
  }

  private async checkAccessToken(accessToken: string, refreshToken: string) {
    try {
      const payload = await this.jwtService.verify(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
      return {payload};
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const payload = await this.jwtService.verify(refreshToken, {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
        });

        const newAccessToken = this.jwtService.sign(
          {
            user_id: payload.user_id,
            email: payload.email,
            name: payload.name,
            nickname: payload.nickname,
          },
          {
            secret: this.configService.get<string>('JWT_SECRET_KEY'),
            expiresIn: '1h',
          },
        );
        console.log('accessToken을 재발급 하였습니다.')
        return {payload, newAccessToken};
      }
    }
  }

  private async checkRefreshToken(
    user_id: number,
    refreshToken: string,
    response: Response,
  ) {
    try {
      const payloadRefreshToken = await this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        await this.userToken.delete({
          user_id: { user_id: user_id },
          token: refreshToken,
        });
        this.clearAuthCookies(response);
        return response.redirect('/');
      }
      return response.redirect('/');
    }
  }

  private clearAuthCookies(response: Response) {
    response.clearCookie('user_access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    response.clearCookie('user_refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}
