import {Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./auth.guard";
import {LoginDto} from "./auth.dto";
import {Response} from "express";
import {ConfigService} from "@nestjs/config";
import { Public } from "./decorator/public.decorator";

@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {}

    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        try {
            const login_user = await this.authService.login(loginDto);

            res.cookie('user_access_token', login_user.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            })

            res.cookie('user_refresh_token', login_user.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            })

            res.status(HttpStatus.OK).json({data: login_user});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "로그인 과정에 오류가 발생하였습니다. 다시 시도해 주세요."})
        }
    }

    @Public()
    @Post('/logout')
    async logout(@Res() res: Response) {
        try {
            res.clearCookie('user_access_token');
            res.clearCookie('user_refresh_token');
            res.status(HttpStatus.OK).json({message: '로그아웃 완료'})
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "로그아웃 과정에 오류가 발생하였습니다. 다시 시도해 주세요."})
        }
    }

    @Get('/me')
    async me(@Req() req) {
       return {
            user_id: req.user.user_id,
            email: req.user.email,
            name: req.user.name,
            nickname: req.user.nickname,
       }
    }
}