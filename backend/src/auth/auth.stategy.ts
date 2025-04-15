import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from  'passport-jwt'
import {ConfigService} from "@nestjs/config";
import {Injectable, UnauthorizedException} from "@nestjs/common";

@Injectable()
export class AuthStrategy extends PassportStrategy (
    Strategy,
    'jwt-service'
) {
    constructor(private readonly configService: ConfigService) {
        const secretKey = configService.get<string>('JWT_SECRET_KEY');
        if (!secretKey) {
            throw new Error('키를 찾을 수 없습니다.')
        }
        super({
            secretOrKey: secretKey,
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => request?.cookies?.user_access_token
            ])
        });
    }

    async validate(payload: any) {
        if (!payload) {
            throw new UnauthorizedException('인증 오류');
        }
        return {
            user_id: payload.user_id,
            name: payload.name,
            nickname: payload.nickname
        }
    }
}