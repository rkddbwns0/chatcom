import {Body, Controller, Get, Post, Query, Res, UseGuards} from "@nestjs/common";
import {FriendsService} from "./friends.service";
import {ApiOperation} from "@nestjs/swagger";
import {ResponseFriendDto, SendFriendDto} from "./friends.dto";
import {Response} from "express";
import { UserEntity } from "src/entities/user.entity";
import { JwtAuthGuard } from "src/auth/auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('/friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}

    @ApiOperation({summary: '친구 목록 조회 라우터'})
    @Get('/friend_list')
    async friend_list(@Res() res: Response, @Query('user_id') user_id: UserEntity) {
        try {
            const result = await this.friendsService.friend_list(user_id);
            res.status(200).json({data: result})
        } catch (error) {
            console.error(error);
            res.status(500).json({message: error.message})
        }
    }

    @ApiOperation({summary: '친구 요청 보내기 라우터'})
    @Post('/send_request')
    async sendFriend(@Body() sendFriendDto: SendFriendDto, @Res() res: Response) {
        try {
            const result = await this.friendsService.sendFreind(sendFriendDto);
            res.status(200).json({message: result?.message})
        } catch (error) {
            console.error('에러 내용 : ', error.message);
            if (error.name === 'BadRequestException') {
                res.status(400).json({message: error.message})
            } else {
                res.status(500).json({message: error.message})
            }
        }
    }

    @ApiOperation({summary: '친구 요청 처리 라우터'})
    @Post('/response_friend')
    async response_friend(@Body() responseFriendDto: ResponseFriendDto, @Res() res: Response) {
        try {
            await this.friendsService.responseFriend(responseFriendDto);
            res.status(200).json({message: `요청을 ${responseFriendDto.status}하였습니다.`})
        } catch (error) {
            console.log(error);
            res.status(500).json({message: error.message})
        }
    }
}