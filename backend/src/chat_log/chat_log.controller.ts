import {Body, Controller, Post, Res} from "@nestjs/common";
import {ChatLogService} from "./chat_log.service";
import {CreateChatLogDto} from "./chat_log.dto";
import {Response} from "express";

@Controller('chat_log')
export class ChatLogController {
    constructor(private readonly chatLogService: ChatLogService) {}

    @Post('/createChatLog')
    async createChatLog(@Body() createChatLogDto: CreateChatLogDto, @Res() res: Response) {
        try {
            const result = await this.chatLogService.createChatLog(createChatLogDto);
            res.status(200).json(result)
        } catch (e) {
            console.error(e);
        }
    }
}