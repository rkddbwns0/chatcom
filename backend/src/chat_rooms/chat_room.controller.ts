import {Body, Controller, Post, Res} from "@nestjs/common";
import {ChatRoomService} from "./chat_room.service";
import {CreateRoomDto} from "./chat_room.dto";
import {Response} from "express";

@Controller('chat_room')
export class ChatRoomController {
    constructor(
        private readonly chatRoomService: ChatRoomService
    ) {}

    @Post('/create')
    async createRoom(@Body() createRoomDto: CreateRoomDto, @Res() res: Response) {
        try {
            const result = await this.chatRoomService.createRoom(createRoomDto);
            res.status(200).json({message: result?.message});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: error.message});
        }
    }
}