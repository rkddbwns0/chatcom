import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat_roomEntity } from '../entities/chat_room.entity';
import { Repository } from 'typeorm';
import { RoomMebersEntity } from '../entities/room_members.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ChatLog, ChatLogDocument } from './schema/chat_log.schema';
import { Model } from 'mongoose';
import { CreateChatLogDto } from './chat_log.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class ChatLogService {
  constructor(
    @InjectRepository(Chat_roomEntity)
    private readonly chat_room: Repository<Chat_roomEntity>,

    @InjectRepository(RoomMebersEntity)
    private readonly roomParticipants: Repository<RoomMebersEntity>,

    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,

    @InjectModel(ChatLog.name)
    private readonly chatLog: Model<ChatLogDocument>,
  ) {}

  private async findRoomId(room_id: number) {
    try {
      const roomId = await this.chat_room.findOne({
        where: { room_id: room_id },
      });

      if (!roomId) {
        throw new BadRequestException('존재하지 않는 채팅방입니다.');
      }

      return roomId?.room_id;
    } catch (error) {
      console.log(error);
    }
  }

  private async findUserId(room_id: any, user_id: any) {
    try {
      const userId = await this.roomParticipants.findOne({
        where: { room_id: room_id, user_id: user_id },
      });
      if (!userId) {
        throw new BadRequestException('존재하지 않는 유저입니다.');
      }
      const user = await this.user.findOne({ where: { user_id: user_id } });
      return user?.nickname;
    } catch (error) {
      console.log(error);
    }
  }

  async sendMessage(createChatLogDto: CreateChatLogDto) {
    try {
      const room = await this.findRoomId(createChatLogDto.room_id);
      const user = await this.findUserId(room!, createChatLogDto.user_id);
      console.log(createChatLogDto);

      createChatLogDto.nickname = user!;

      const chatLog = new this.chatLog(createChatLogDto);
      await chatLog.save();
      return chatLog;
    } catch (error) {
      console.error(error);
    }
  }

  async findAllChatLogs(room_id: number) {
    try {
      const chatLogs = await this.chatLog
        .find({
          room_id: room_id,
        })
        .sort({ created_at: 1 });
      return chatLogs;
    } catch (error) {
      console.log(error);
    }
  }
}
