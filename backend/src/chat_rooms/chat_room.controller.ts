import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ChatRoomService } from './chat_room.service';
import { CreateRoomDto } from './chat_room.dto';
import { Response } from 'express';

@Controller('chat_room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post('/create')
  async createRoom(@Body() createRoomDto: CreateRoomDto, @Res() res: Response) {
    try {
      const result = await this.chatRoomService.createRoom(createRoomDto);
      res.status(200).json({ message: result?.message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }

  @Get('/chat_list')
  @HttpCode(200)
  async chatList(@Query('user_id') user_id: number) {
    try {
      const result = await this.chatRoomService.chatList(user_id);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
