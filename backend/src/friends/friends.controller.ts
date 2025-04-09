import {Body, Controller, HttpException, HttpStatus, Post, Res} from "@nestjs/common";
import {FriendsService} from "./friends.service";
import {ApiOperation} from "@nestjs/swagger";
import {ResponseFriendDto, SendFriendDto} from "./friends.dto";
import {Response} from "express";

@Controller('/friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}

    @ApiOperation({summary: '친구 요청 보내기 라우터'})
    @Post('/send_request')
    async sendFriend(@Body() sendFriendDto: SendFriendDto, @Res() res: Response) {
        try {
            const result = await this.friendsService.sendFreind(sendFriendDto);
            res.status(200).json({message: result.message})
        } catch (error) {
            console.log(error);
            res.status(500).json({message: error.message})
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