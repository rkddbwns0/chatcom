import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {In, Repository} from "typeorm";
import {LoginDto} from "./auth.dto";
import * as bctrypt from 'bcrypt'
import {JwtService} from "@nestjs/jwt";
import {UserTokenEntity} from "../entities/user_token.entity";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        
        @InjectRepository(UserEntity)
        private readonly user: Repository<UserEntity>,

        @InjectRepository(UserTokenEntity)
        private readonly userToken: Repository<UserTokenEntity>
    ) {}

    async login(loginDto: LoginDto){
        const user = await this.validateUser(loginDto);
        const accessToken = await this.validateAccessToken(user!);
        const refreshToken = await this.validateRefreshToken(user!);

        const userInfo = {
            user_id: user?.user_id,
            email: user?.email,
            name: user?.name,
            nickname: user?.nickname,
        }

        return { user: userInfo, accessToken, refreshToken};
    }

    private async validateUser(loginDto: LoginDto): Promise<UserEntity | undefined> {
        try {
            const user = await this.user.findOne({
                where: {
                    email: loginDto.email,
                }
            })
            if (!user) {
                throw new ForbiddenException("존재하지 않는 사용자입니다.");
            } 

            if (!(await bctrypt.compare(loginDto.password, user.password))) {
                throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
            }

            return user;
        } catch (error) {
            console.error(error);
        }
    }

    private async validateAccessToken(user: UserEntity): Promise<string> {
        const payload = {
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            nickname: user.nickname,
        }

        const accessToken = this.jwtService.sign(payload, {expiresIn: '1h', secret: this.configService.get<string>('JWT_SECRET_KEY')});

        return accessToken;
    }

    private async validateRefreshToken(user: UserEntity){
        try {
            const payload = {
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                nickname: user.nickname,
            }

            const refreshToken = this.jwtService.sign(payload, {expiresIn: '7h', secret: this.configService.get<string>('JWT_SECRET_KEY')});
            
            const token = this.userToken.create({
                user_id: user,
                token: refreshToken,
                expires_in: new Date(Date.now() + 7 * 60 * 60 * 1000),
            });
            await this.userToken.save(token)

            return refreshToken;
        }
        catch (error) {
            console.error(error);
        }
    }

    async logout(user_id: UserEntity) {
        try {
            await this.userToken.delete({user_id: user_id})
            return true
        } catch (error) {
            console.error(error);
        }
    }
}  