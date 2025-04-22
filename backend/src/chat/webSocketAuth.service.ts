import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { UserTokenEntity } from "src/entities/user_token.entity";
import { Repository } from "typeorm";

@Injectable()
export class WebSocketAuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,

        @InjectRepository(UserTokenEntity)
        private readonly user_token: Repository<UserTokenEntity>
    ) {}
    
    async validateAccessToken(token: string, refresh_token: string) {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET_KEY'),
            });
            return payload;
        } catch (error) {
            console.log(error.name)
            if (error.name === 'TokenExpiredError') {
                return this.handleTokenExpiredError(refresh_token)
            }
            throw new UnauthorizedException('인증 오류입니다.')
        }
    }

    async handleTokenExpiredError(refresh_token: string): Promise<any> {
        try {
            const payload = await this.jwtService.verify(refresh_token, {
                secret: this.configService.get<string>('JWT_SECRET_KEY'),
            })

            await this.validateRefreshToken(refresh_token, payload.user_id)

            return await this.refreshAccessToken(payload)
        } catch (error) {
            throw new UnauthorizedException('refresh token 만료')
        }
    }

    async refreshAccessToken(payload: any): Promise<any> {
        const newAccessToken = this.jwtService.sign({
            user_id: payload.user_id,
            email: payload.email,
            nickname: payload.nickname,
        }, 
        {
            secret: this.configService.get<string>('JWT_SECRET_KEY'),
            expiresIn: '1h'
        })

        const newPayload = {
            user_id: payload.user_id,
            email: payload.email,
            nickname: payload.nickname,
        }

        console.log(newAccessToken, '새로운 토큰')
        return {newAccessToken, newPayload}
    }

    async validateRefreshToken(token: string, user_id: UserEntity): Promise<boolean> {
        try {
            const today = new Date();
            console.log(today)

            const storeToken = await this.user_token.findOne({
                where: {
                    user_id: user_id,
                    token: token
                }
            })

            if (!storeToken) {
                throw new UnauthorizedException('토큰이 존재하지 않습니다.')
            }

            if (storeToken.expires_in < today) {
                await this.user_token.remove(storeToken)
            }

            return true;
        } catch (error) {
            console.error(error);
            throw new UnauthorizedException('인증 오류입니다.')
        }
    }
}
