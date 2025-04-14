import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtraJwt} from  'passport-jwt'
import {ConfigService} from "@nestjs/config";

export class AuthStategy extends PassportStrategy (
    Strategy,
    'jwt-service'
) {
    constructor(private readonly configService: ConfigService) {
        super({
            secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
            ignoreExpiration: false,
            jwtFromRequest: ExtraJwt.fromExtractor([
                (request) => {
                    return request?.cookies.tokens
                }
            ])
        });
    }

    async validate(payload: any) {
        return {
            user_id: payload.user_id,
            name: payload.name,
            nickname: payload.nickname
        }
    }
}