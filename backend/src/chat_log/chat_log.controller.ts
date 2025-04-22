import {Body, Controller, Get, Post, Query, Req, Res, UseGuards} from "@nestjs/common";
import {ChatLogService} from "./chat_log.service";
import {Response} from "express";
import { JwtAuthGuard } from "src/auth/auth.guard";
import { Number } from "mongoose";

@UseGuards(JwtAuthGuard)
@Controller('chat_log')
export class ChatLogController {
    constructor(private readonly chatLogService: ChatLogService) {}

    @Get('/chatList')
    async getChatList(@Query('room_id') room_id: number, @Res() res: Response, @Req() req) {
        console.log(room_id)
        try {
            
            const list = await this.chatLogService.findAllChatLogs(room_id)
            res.status(200).json(list)
        } catch (error) {
            console.error(error);
            res.status(500).json({message: error.message});
        }
    }
}