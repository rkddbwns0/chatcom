import {Body, Controller, HttpCode, Post, Res} from "@nestjs/common";
import {UserService} from "../services/user.service";
import {CreateUserDto} from "../dto/user.dto";
import {Response} from "express";

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