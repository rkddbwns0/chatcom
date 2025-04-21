import {Body, Controller, HttpCode, Post, Res, UseGuards} from "@nestjs/common";
import {UserService} from "./user.service";
import {CreateUserDto} from "./user.dto";
import {Response} from "express";
import { JwtAuthGuard } from "src/auth/auth.guard";
import { Public } from "src/auth/decorator/public.decorator";
import { LoginDto } from "src/auth/auth.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}
    
    @Post('/signup')
    async createUser(@Body() createuserDto: CreateUserDto, @Res() res: Response) {
        try {
            const result = await this.userService.createUser(createuserDto);
            console.log(result);
            res.status(200).json({message: '가입이 완료되었습니다.', result: result})
        } catch (error) {
            console.error(error)
            res.status(400).json({message: error.message})
        }
    }
}