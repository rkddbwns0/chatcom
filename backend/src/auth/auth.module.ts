import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {UserTokenEntity} from "../entities/user_token.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, UserTokenEntity]),
        JwtModule.registerAsync({
            global: true,
            useFactory: async (configService: ConfigService) => ({
                secret: '',
                signOptions: {expiresIn: '7h'}
            }),
            inject: [ConfigService]
        })
    ],
    providers: [AuthService],
    controllers: [AuthController],
})

export class AuthModule {}