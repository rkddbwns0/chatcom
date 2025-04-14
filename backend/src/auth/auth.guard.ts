import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {InjectRepository} from "@nestjs/typeorm";
import {UserTokenEntity} from "../entities/user_token.entity";
import {Repository} from "typeorm";
import {response} from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private configService: ConfigService,

        @InjectRepository(UserTokenEntity)
        private readonly userToken: Repository<UserTokenEntity>
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getClass(),
            context.getHandler()
        ]);
        if (isPublic) {
            return true
        }

        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const accessToken = request.cooikes['user_access_token'];
        const refreshToken = request.cooikes['user_refresh_token'];
        const user = request.body.user || request.params.user;

        if (!accessToken) {
            throw new UnauthorizedException('토큰이 만료되었습니다. 다시 로그인해 주세요.');
        }

        await this.checkAccessToken(accessToken)
        await this.checkRefreshToken(user, refreshToken)

        return false
    }

    private async checkAccessToken(accessToken: string) {
        const payload = await this.jwtService.verify(accessToken, {
            secret: this.configService.get<string>('JWT_SECRET_KEY'),
        })
        return payload;
    }

    private async checkRefreshToken(user_id: number, refreshToken: string) {
        try {
            const payloadRefreshToken = await this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_SECRET_KEY'),
            })
            return true
        } catch (error) {
            console.error(error);
            if(error.name === 'TokenExpiredError') {
                await this.userToken.delete({user_id: {user_id: user_id}, token: refreshToken})

                response.clearCookie('user_access_token')
                response.clearCookie('user_refresh_token')
                throw new UnauthorizedException('토큰이 만료되었습니다. 다시 로그인해 주세요.');
            }
            throw new UnauthorizedException(error.message);
        }
    }
}
