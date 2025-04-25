import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {InjectRepository} from "@nestjs/typeorm";
import {UserTokenEntity} from "../entities/user_token.entity";
import {Not, Repository} from "typeorm";
import {Response, response} from "express";
import {IS_PUBLIC_KEY} from "./decorator/public.decorator";
import {AuthGuard} from "@nestjs/passport";
import { Logger } from "@nestjs/common";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-service') implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private configService: ConfigService,

        @InjectRepository(UserTokenEntity)
        private readonly userToken: Repository<UserTokenEntity>
    ) {super()}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const logger = new Logger('JwtAuthGuard');

        const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getClass(),
            context.getHandler()
        ]);
        if (isPublic) {
            return true
        }

        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const accessToken = request.cookies['user_access_token'];
        const refreshToken = request.cookies['user_refresh_token'];

        if (!accessToken || !refreshToken) {
            this.clearAuthCookies(response)
            return response.redirect('/')
        }

        const access_payload = await this.checkAccessToken(accessToken)
        await this.checkRefreshToken(access_payload.user_id, refreshToken, response)

        if(!(access_payload && access_payload.user_id)) {
            this.clearAuthCookies(response)
            response.redirect('/')
        }
        request.user = access_payload;

        try {
            const today = new Date();
            const store_token = await this.userToken.findOne({
                where: {
                    user_id: request.user_id,
                    token: refreshToken
                }
            });
            if (!store_token) {
                await this.userToken.delete({
                    user_id: request.user_id,
                    token: Not(refreshToken)
                })
                this.clearAuthCookies(response)
                return response.redirect('/')
            }
            if(store_token.expires_in < today) {
                await this.userToken.remove(store_token)
                this.clearAuthCookies(response)
                return response.redirect('/')
            }
        } catch (error) {
            logger.error(error.stack);
            this.clearAuthCookies(response)
            return response.redirect('/')
        }

        return true
    }

    private async checkAccessToken(accessToken: string) {
        const payload = await this.jwtService.verify(accessToken, {
            secret: this.configService.get<string>('JWT_SECRET_KEY'),
        })
        return payload;
    }

    private async checkRefreshToken(user_id: number, refreshToken: string, response: Response) {
        try {
            const payloadRefreshToken = await this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_SECRET_KEY'),
            })
            return true
        } catch (error) {
            if(error.name === 'TokenExpiredError') {
                await this.userToken.delete({user_id: {user_id: user_id}, token: refreshToken})
                this.clearAuthCookies(response)
                return response.redirect('/')
            }
            return response.redirect('/')
        }
    }

    private clearAuthCookies(response: Response) {
        response.clearCookie('user_access_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })
        response.clearCookie('user_refresh_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })
    }
}
